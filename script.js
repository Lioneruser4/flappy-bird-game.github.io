// Game variables
let cards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let matchedPairs = 0;
let totalPairs = 6;
let level = 1;
const MAX_LEVEL = 1000; 
let score = 0;

// Time Variables
let timerInterval;
let timeElapsed = 0; 

// Score Variables
const SCORE_MATCH = 100;
const SCORE_MISMATCH = -20;

// =================================================================
// 📸 NEW PHOTO PATHS ARRAY
// Changed from ALL_EMOJIS to PHOTO_PATHS to use your files
// NOTE: Spaces in filenames are handled with encodeURIComponent
// This array contains 8 unique paths (16 total images needed for 8 pairs)
const PHOTO_PATHS = [
    'photos/photo (1).jpg',  // Assuming .jpg, change to .png if needed
    'photos/photo (2).jpg',
    'photos/photo (3).jpg',
    'photos/photo (4).jpg',
    'photos/photo (5).jpg',
    'photos/photo (6).jpg',
    'photos/photo (7).jpg',
    'photos/photo (8).jpg',
    // We only need 8 unique images for up to 8 pairs (Level 2)
    // If you plan to use Level 3 (10 pairs), add two more unique photo paths here:
    // 'photos/photo (9).jpg',
    // 'photos/photo (10).jpg'
];
// =================================================================

// DOM elements and Sounds
let memoryBoard, movesDisplay, matchedDisplay, timerDisplay, scoreDisplay, adContainer, finalMovesDisplay, finalScoreDisplay, currentLevelDisplay, themeIcon;
let flipSound, matchSound, mismatchSound, winSound, gameoverSound;
let onlineUsersDisplay; 

// PubNub Variables
let pubnub;
const PUBNUB_CHANNEL = 'memory_game_online'; 

document.addEventListener('DOMContentLoaded', function() {
    // Select DOM Elements
    memoryBoard = document.getElementById('memory-board');
    movesDisplay = document.getElementById('moves');
    matchedDisplay = document.getElementById('matched');
    timerDisplay = document.getElementById('timer');
    scoreDisplay = document.getElementById('score');
    adContainer = document.getElementById('ad-container');
    finalMovesDisplay = document.getElementById('final-moves');
    finalScoreDisplay = document.getElementById('final-score');
    currentLevelDisplay = document.getElementById('current-level');
    themeIcon = document.getElementById('theme-icon');
    onlineUsersDisplay = document.getElementById('online-users');
    
    // Select sound elements
    flipSound = document.getElementById('flip-sound');
    matchSound = document.getElementById('match-sound');
    mismatchSound = document.getElementById('mismatch-sound');
    winSound = document.getElementById('win-sound');
    gameoverSound = document.getElementById('gameover-sound');

    // Button Events
    document.getElementById('restart-button').addEventListener('click', function() {
        level = 1; // Main button always starts from Level 1
        initGame();
    });
    document.getElementById('theme-toggle-button').addEventListener('click', toggleDarkMode);

    // Check Theme Mode
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.textContent = '☀️';
    }
    
    initPubNub();
    startGame();
});

// PubNub Connection and Live Counter Logic
function initPubNub() {
    // ENTER YOUR KEYS HERE (Keys obtained from your PubNub Account)
    pubnub = new PubNub({
        publishKey: 'YOUR_PUB_KEY', // <-- Replace this with your own key
        subscribeKey: 'YOUR_SUB_KEY', // <-- Replace this with your own key
        userId: 'user-' + Math.random().toString(36).substring(2, 9) // Unique ID for each user
    });

    // Listen for User (Presence) changes
    pubnub.addListener({
        presence: function(presenceEvent) {
            if (presenceEvent.channel === PUBNUB_CHANNEL) {
                onlineUsersDisplay.textContent = presenceEvent.occupancy;
            }
        }
    });

    pubnub.subscribe({
        channels: [PUBNUB_CHANNEL],
        withPresence: true 
    });
    
    // Get the current online count on initial load
    pubnub.hereNow({
        channels: [PUBNUB_CHANNEL]
    }, function(status, response) {
        if (response && response.channels && response.channels[PUBNUB_CHANNEL]) {
            onlineUsersDisplay.textContent = response.channels[PUBNUB_CHANNEL].occupancy;
        }
    });
}


// Lag-free Sound Playback Function
function playSound(audioElement) {
    if (!audioElement) return;
    const clone = audioElement.cloneNode();
    clone.volume = 0.5;
    clone.play();
}

// Start Game
function startGame() {
    initGame();
}

// Reset and start the game
function initGame() {
    clearInterval(timerInterval);

    // Define card count based on level
    if (level === 1) totalPairs = 6; // 12 cards
    else if (level === 2) totalPairs = 8; // 16 cards
    else if (level >= MAX_LEVEL) totalPairs = 8; // Max 8 pairs due to limited photo paths
    
    // Resets
    memoryBoard.innerHTML = '';
    moves = 0;
    matchedPairs = 0;
    if (level === 1) score = 0; 
    timeElapsed = 0;
    lockBoard = false;
    hasFlippedCard = false;
    firstCard = null;
    secondCard = null;

    // DOM updates
    movesDisplay.textContent = moves;
    scoreDisplay.textContent = score;
    document.getElementById('total-pairs').textContent = totalPairs;
    matchedDisplay.textContent = matchedPairs;
    currentLevelDisplay.textContent = `(Level ${level})`;
    timerDisplay.textContent = formatTime(timeElapsed);
    timerDisplay.style.color = 'inherit'; 
    
    createCards();
    startTimer();
    adContainer.classList.remove('show');
    adContainer.classList.add('hidden');
}

// Unlimited Time Counter
function startTimer() {
    timerInterval = setInterval(() => {
        timeElapsed++;
        timerDisplay.textContent = formatTime(timeElapsed);
    }, 1000);
}

// Converts time to Minute:Second format
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}

// Create Cards
function createCards() {
    // Define card layout and sizes according to level
    memoryBoard.className = 'memory-board';
    if (totalPairs === 6) memoryBoard.classList.add('grid-4x3');
    else if (totalPairs === 8) memoryBoard.classList.add('grid-4x4');
    // REMOVED 4x5 grid logic since you only provided 8 unique photos.
    
    // PHOTO LOGIC: Random new photo paths for each level
    const shuffledPhotoPaths = shuffleArray([...PHOTO_PATHS]);
    const selectedPhotoPaths = shuffledPhotoPaths.slice(0, totalPairs); 
    const gameCards = selectedPhotoPaths.flatMap(path => [path, path]);
    shuffleArray(gameCards);
    
    // Create card elements
    gameCards.forEach((path, index) => {
        // We use encodeURIComponent to safely handle spaces in the filename like 'photo (1).jpg'
        const safePath = encodeURIComponent(path);
        
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.path = safePath; // Store the photo path in a data attribute
        card.dataset.index = index;
        
        // =================================================================
        // 📸 MAJOR CHANGE: Use <img> tag instead of innerHTML for the back side
        // The image uses object-fit: cover (defined in CSS, see notes below)
        // to ensure it fills the card area without distortion.
        card.innerHTML = `<div class="front"></div><div class="back"><img src="${safePath}" alt="Memory Game Card" class="card-image"></div>`;
        // =================================================================
        
        card.addEventListener('click', flipCard);
        memoryBoard.appendChild(card);
        cards.push(card);
    });
}

// Card flip operation
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    if (this.classList.contains('flipped')) return;

    playSound(flipSound);

    this.classList.add('flipped');
    
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    
    secondCard = this;
    moves++;
    movesDisplay.textContent = moves;
    
    checkForMatch();
}

// Check for match
function checkForMatch() {
    // We check the photo path stored in the 'data-path' attribute
    const isMatch = firstCard.dataset.path === secondCard.dataset.path;
    
    if (isMatch) {
        score += SCORE_MATCH;
        scoreDisplay.textContent = score;

        playSound(matchSound);
        disableCards();
        matchedPairs++;
        matchedDisplay.textContent = `${matchedPairs}/${totalPairs}`;
        
        if (matchedPairs === totalPairs) {
            clearInterval(timerInterval);
            handleGameOver(true);
        }
    } else {
        score += SCORE_MISMATCH;
        if (score < 0) score = 0; 
        scoreDisplay.textContent = score;

        playSound(mismatchSound);
        unflipCards();
    }
}

// Mark matched cards and keep them open (with Animation)
function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    resetBoard();
}

// Flip back unmatched cards
function unflipCards() {
    lockBoard = true;
    
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

// Reset the game board
function resetBoard() {
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
}

// Game Over Panel
function handleGameOver(isSuccess) {
    lockBoard = true;

    finalMovesDisplay.textContent = moves;
    finalScoreDisplay.textContent = score;
    
    const adTitle = document.getElementById('ad-title');
    const finalMessage = document.querySelector('.final-message');
    const nextLevelBtn = document.getElementById('next-level');
    const restartLevelBtn = document.getElementById('restart-level');
    const adContent = document.getElementById('ad-content'); 

    if (isSuccess) {
        playSound(winSound);
        
        // MAXIMUM LEVEL LOGIC MODIFIED
        if (level < 2) { // Allow progression from Level 1 (6 pairs) to Level 2 (8 pairs)
            adTitle.textContent = 'Congratulations! 🎉 Level Passed!';
            finalMessage.textContent = `The next level will have ${totalPairs + 2} pairs.`;

            // Main button: Next Level
            nextLevelBtn.textContent = `Next Level (${level + 1})`;
            nextLevelBtn.onclick = null; 
            nextLevelBtn.onclick = function() { 
                adContainer.classList.remove('show'); 
                adContainer.classList.add('hidden');
                level++; 
                initGame(); // New level, new card count
            };
            nextLevelBtn.style.display = 'block'; 
            restartLevelBtn.style.display = 'block';

        } else {
            // Level is 2 or higher, maximum pairs reached with 8 photos.
            adTitle.textContent = ' 🏆 Maximum Pairs Reached!';
            finalMessage.textContent = `You've matched all available ${totalPairs} pairs with a score of ${score}!`;
            
            // Main button: Play Again (Same Level)
            nextLevelBtn.textContent = 'Play Next Game'; 
            nextLevelBtn.onclick = null;
            nextLevelBtn.onclick = function() { 
                adContainer.classList.remove('show'); 
                adContainer.classList.add('hidden');
                // level does not change, just new photo shuffle
                initGame(); 
            }; 

            // The second button (Play Again) should also do the same function.
            restartLevelBtn.textContent = 'Play Again (This Level)';
            restartLevelBtn.style.display = 'block'; 
        }
    }
    
    // Restart Level button event
    document.getElementById('restart-level').onclick = function() {
        adContainer.classList.remove('show'); 
        adContainer.classList.add('hidden');
        initGame(); // Restart the current level
    };

    // ------------------------------------------------------------------
    // ⭐ AD CODE ADDITION - Kept as is ⭐
    // ------------------------------------------------------------------
    adContent.innerHTML = `
        <div class="ad-iframe-container">
            <script type='text/javascript' src='//pl27810690.effectivegatecpm.com/3f/56/0c/3f560cd28640fec16294d033439790e5.js'></script>
        </div>
    `;

    adContainer.classList.remove('hidden');
    adContainer.classList.add('show');
}

// Array shuffle function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Night/Day Mode
function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    if (isDark) {
        localStorage.setItem('theme', 'dark');
        themeIcon.textContent = '☀️';
    } else {
        localStorage.setItem('theme', 'light');
        themeIcon.textContent = '🌙';
    }
}
