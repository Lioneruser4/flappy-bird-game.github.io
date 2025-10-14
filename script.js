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
// 📸 KESİN FOTOĞRAF YOLLARI (SADECE .jpg KULLANILDIĞI VARSAYILIR)
// Dosya adınız 'photo (1).jpg' olduğu için, boşluklar kodda temizlenir.
const PHOTO_PATHS = [
    'photos/photo (1).jpg',
    'photos/photo (2).jpg',
    'photos/photo (3).jpg',
    'photos/photo (4).jpg',
    'photos/photo (5).jpg',
    'photos/photo (6).jpg',
    'photos/photo (7).jpg',
    'photos/photo (8).jpg',
];
// =KEZİNLİKLE BU KODDA ALL_EMOJIS DİZİSİ YOKTUR =

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
        level = 1; 
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

// PubNub Connection and Live Counter Logic (Değişiklik yapılmadı)
function initPubNub() {
    pubnub = new PubNub({
        publishKey: 'YOUR_PUB_KEY',
        subscribeKey: 'YOUR_SUB_KEY',
        userId: 'user-' + Math.random().toString(36).substring(2, 9)
    });

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
    
    pubnub.hereNow({
        channels: [PUBNUB_CHANNEL]
    }, function(status, response) {
        if (response && response.channels && response.channels[PUBNUB_CHANNEL]) {
            onlineUsersDisplay.textContent = response.channels[PUBNUB_CHANNEL].occupancy;
        }
    });
}


// Lag-free Sound Playback Function (Değişiklik yapılmadı)
function playSound(audioElement) {
    if (!audioElement) return;
    const clone = audioElement.cloneNode();
    clone.volume = 0.5;
    clone.play();
}

// Start Game (Değişiklik yapılmadı)
function startGame() {
    initGame();
}

// Reset and start the game (Değişiklik yapılmadı)
function initGame() {
    clearInterval(timerInterval);

    // Define card count based on level
    if (level === 1) totalPairs = 6; // 12 cards
    else if (level === 2) totalPairs = 8; // 16 cards
    else if (level >= MAX_LEVEL) totalPairs = 8;
    
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

// Unlimited Time Counter (Değişiklik yapılmadı)
function startTimer() {
    timerInterval = setInterval(() => {
        timeElapsed++;
        timerDisplay.textContent = formatTime(timeElapsed);
    }, 1000);
}

// Converts time to Minute:Second format (Değişiklik yapılmadı)
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}

// Create Cards (RESİM ENTEGRASYONU)
function createCards() {
    // Define card layout and sizes according to level
    memoryBoard.className = 'memory-board';
    if (totalPairs === 6) memoryBoard.classList.add('grid-4x3');
    else if (totalPairs === 8) memoryBoard.classList.add('grid-4x4');
    
    // PHOTO LOGIC: Shuffle and select the photo paths
    const shuffledPhotoPaths = shuffleArray([...PHOTO_PATHS]);
    const selectedPhotoPaths = shuffledPhotoPaths.slice(0, totalPairs); 
    const gameCards = selectedPhotoPaths.flatMap(path => [path, path]);
    shuffleArray(gameCards);
    
    // Create card elements
    gameCards.forEach((path, index) => {
        // Boşlukları URL uyumlu hale getir (%20 kullanılır)
        const safePath = path.replace(/ /g, '%20');
        
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.path = safePath; // Eşleşme kontrolü için path'i kaydet
        card.dataset.index = index;
        
        // Kartın arka yüzüne resim ekleme (<img>)
        card.innerHTML = `
            <div class="front"></div>
            <div class="back">
                <img src="${safePath}" alt="Memory Game Card" class="card-image">
            </div>
        `;
        
        card.addEventListener('click', flipCard);
        memoryBoard.appendChild(card);
        cards.push(card);
    });
}

// Card flip operation (Değişiklik yapılmadı)
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

// Check for match (Değişiklik yapılmadı)
function checkForMatch() {
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

// Mark matched cards and keep them open (with Animation) (Değişiklik yapılmadı)
function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    resetBoard();
}

// Flip back unmatched cards (Değişiklik yapılmadı)
function unflipCards() {
    lockBoard = true;
    
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

// Reset the game board (Değişiklik yapılmadı)
function resetBoard() {
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
}

// Game Over Panel (Değişiklik yapılmadı)
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
        
        if (level < 2) { 
            adTitle.textContent = 'Congratulations! 🎉 Level Passed!';
            finalMessage.textContent = `The next level will have ${totalPairs + 2} pairs.`;

            nextLevelBtn.textContent = `Next Level (${level + 1})`;
            nextLevelBtn.onclick = null; 
            nextLevelBtn.onclick = function() { 
                adContainer.classList.remove('show'); 
                adContainer.classList.add('hidden');
                level++; 
                initGame(); 
            };
            nextLevelBtn.style.display = 'block'; 
            restartLevelBtn.style.display = 'block';

        } else {
            adTitle.textContent = ' 🏆 Maximum Pairs Reached!';
            finalMessage.textContent = `You've matched all available ${totalPairs} pairs with a score of ${score}!`;
            
            nextLevelBtn.textContent = 'Play Next Game'; 
            nextLevelBtn.onclick = null;
            nextLevelBtn.onclick = function() { 
                adContainer.classList.remove('show'); 
                adContainer.classList.add('hidden');
                initGame(); 
            }; 

            restartLevelBtn.textContent = 'Play Again (This Level)';
            restartLevelBtn.style.display = 'block'; 
        }
    }
    
    document.getElementById('restart-level').onclick = function() {
        adContainer.classList.remove('show'); 
        adContainer.classList.add('hidden');
        initGame(); 
    };

    adContent.innerHTML = `
        <div class="ad-iframe-container">
            <script type='text/javascript' src='//pl27810690.effectivegatecpm.com/3f/56/0c/3f560cd28640fec16294d033439790e5.js'></script>
        </div>
    `;

    adContainer.classList.remove('hidden');
    adContainer.classList.add('show');
}

// Array shuffle function (Değişiklik yapılmadı)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Night/Day Mode (Değişiklik yapılmadı)
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
