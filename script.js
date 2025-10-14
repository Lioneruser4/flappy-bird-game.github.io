// Game variables
let cards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let matchedPairs = 0;
let totalPairs = 6;
let level = 1;
const MAX_LEVEL = 5; 
let score = 0;
let multiplier = 1; 
let errorLimit = 4; // Başlangıç hata limiti
let errorsMade = 0; 

// Time Variables
let timerInterval;
let timeElapsed = 0;

// Score Variables
const SCORE_MATCH = 100;
const SCORE_MISMATCH = -20;
const MAX_ERROR_LIMIT = 6; 

// Emoji pool
const ALL_EMOJIS = [
    '🐶', '🐱', '🦊', '🐻', '🦁', '🐯', '🦄', '🐮', '🐷', '🐵', 
    '🦉', '🐸', '🍎', '🍊', '🍋', '🍇', '🍉', '🍓', '🍒', '🍑', 
    '🥝', '🍍', '🥥', '🥑', '🚗', '🚕', '🚌', '🚓', '🚑', '🚒', 
    '🚚', '🚢', '🚀', '🚁', '🚂', '⌚', '📱', '💻', '🖥️', 
    '🔑', '🔒', '🔓', '🎲', '🧩', '🎈', '🎁', '🎂', '👑', '💍',
    '🌞', '🌛', '⭐', '🌈', '🔥', '💧', '🌿', '🍄', '🔔', '📚',
    '🔬', '🔭', '💰', '💳', '📧', '💡', '📌', '📎', '💉', '💊' 
];

// DOM elements and Sounds
let memoryBoard, movesDisplay, matchedDisplay, timerDisplay, scoreDisplay, adContainer, finalMovesDisplay, finalScoreDisplay, currentLevelDisplay, themeIcon;
let flipSound, matchSound, mismatchSound, winSound, gameoverSound;
let errorLimitDisplay, multiplierDisplay; 

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
    errorLimitDisplay = document.getElementById('error-limit');
    multiplierDisplay = document.getElementById('multiplier');

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
    
    // PubNub başlatma KODU KALDIRILDI
    startGame();
});


// Lag-free Sound Playback Function
function playSound(audioElement) {
    if (!audioElement) return;
    const clone = audioElement.cloneNode();
    clone.volume = 0.5;
    clone.play();
}

function startGame() {
    initGame();
}

// Reset and start the game
function initGame() {
    clearInterval(timerInterval);

    // Dinamik Kart Sayısı ve Hata Limiti
    if (level === 1) { totalPairs = 6; errorLimit = 4; } // 12 kart
    else if (level === 2) { totalPairs = 8; errorLimit = 4; } // 16 kart
    else if (level === 3) { totalPairs = 10; errorLimit = 5; } // 20 kart
    else if (level === 4) { totalPairs = 12; errorLimit = 5; } // 24 kart 
    else if (level >= MAX_LEVEL) { totalPairs = 12; errorLimit = 6; } // Max seviye

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
    errorsMade = 0;
    multiplier = 1;

    // DOM updates
    movesDisplay.textContent = moves;
    scoreDisplay.textContent = score;
    document.getElementById('total-pairs').textContent = totalPairs;
    matchedDisplay.textContent = matchedPairs;
    currentLevelDisplay.textContent = `Level ${level}`; // Başlık güncellendi
    timerDisplay.textContent = formatTime(timeElapsed);
    // Yeni DOM güncellemeleri
    errorLimitDisplay.textContent = errorLimit - errorsMade;
    multiplierDisplay.textContent = `x${multiplier}`;
    multiplierDisplay.style.visibility = 'visible'; // Görünür yapıldı
    
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
    else if (totalPairs === 10) memoryBoard.classList.add('grid-4x5');
    else if (totalPairs === 12) memoryBoard.classList.add('grid-6x4'); 

    
    // EMOJI LOGIC: Random new emojis for each level
    const shuffledEmojis = shuffleArray([...ALL_EMOJIS]);
    let selectedEmojis = shuffledEmojis.slice(0, totalPairs);
    // Skill kartı iptal edildiği için direkt eşleşen çiftler oluşturulur.
    let gameCards = selectedEmojis.flatMap(emoji => [emoji, emoji]); 

    shuffleArray(gameCards);
    memoryBoard.innerHTML = '';
    cards = []; 

    // Kart Elementlerini Oluştur
    gameCards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        
        // Skill kartı mantığı KALDIRILDI
        let backContent = emoji; 
        
        card.innerHTML = `<div class="front"></div><div class="back">${backContent}</div>`;
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
    const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
    
    if (isMatch) {
        // Eşleşme durumunda skor çarpanı (Multiplier) etkinleştirilir
        score += SCORE_MATCH * multiplier;
        multiplier++;
        multiplierDisplay.textContent = `x${multiplier}`;
        multiplierDisplay.classList.add('active'); 

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
        // Yanlış eşleşme durumunda çarpan sıfırlanır ve hata sayacı artar
        multiplier = 1;
        multiplierDisplay.textContent = `x${multiplier}`;
        multiplierDisplay.classList.remove('active');

        score += SCORE_MISMATCH;
        if (score < 0) score = 0; 
        scoreDisplay.textContent = score;
        
        errorsMade++;
        errorLimitDisplay.textContent = errorLimit - errorsMade;
        
        if (errorsMade >= errorLimit) {
            // Hata limitine ulaşıldı - Oyun Durur ve Yeniden Başlamaz
            lockBoard = true;
            clearInterval(timerInterval);
            unflipCards(); // Son 2 kartı da kapat
            setTimeout(() => {
                handleGameOver(false);
            }, 1300); // Animasyon sonrası bitişi göster
            return;
        }

        playSound(mismatchSound);
        unflipCards();
    }
}

// Mark matched cards and keep them open (with Animation)
function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    
    firstCard.classList.add('match-success'); 
    secondCard.classList.add('match-success');
    
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    resetBoard();
}

// Flip back unmatched cards
function unflipCards() {
    lockBoard = true;
    
    firstCard.classList.add('mismatch-fail');
    secondCard.classList.add('mismatch-fail');
    
    setTimeout(() => {
        // Hata durumunda sadece kartları çeviriyoruz, kilitlenmeyi kaldırmıyoruz
        firstCard.classList.remove('flipped', 'mismatch-fail');
        secondCard.classList.remove('flipped', 'mismatch-fail');
        
        if (errorsMade < errorLimit) {
            resetBoard(); // Hata limiti aşılmadıysa tahtayı aç
        } else {
            // Hata limiti aşıldıysa tahtayı kilitli tut
            firstCard = null;
            secondCard = null;
        }
    }, 1200); 
}

// Reset the game board
function resetBoard() {
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
    // Animasyon sınıflarını temizle
    cards.forEach(card => {
        card.classList.remove('match-success');
    });
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
    
    if (isSuccess) {
        playSound(winSound);
        
        if (level < MAX_LEVEL) {
             adTitle.textContent = 'Congratulations! 🎉 Level Passed!';
             finalMessage.textContent = `You unlocked Level ${level + 1}!`;
             nextLevelBtn.textContent = `Next Level (${level + 1})`;
             nextLevelBtn.onclick = function() { level++; initGame(); };
        } else {
             adTitle.textContent = ' 🏆 Grand Champion!';
             finalMessage.textContent = `You completed all challenges with a score of ${score}!`;
             nextLevelBtn.textContent = 'Play Again (Max Level)';
             nextLevelBtn.onclick = function() { initGame(); };
        }
    } else {
        playSound(gameoverSound);
        adTitle.textContent = 'Game Over! 😔';
        // Kaybedince yeniden başlatılmasın, butonlar Start New Game'e yönlendirsin
        finalMessage.textContent = `You ran out of moves! Final Score: ${score}.`;
        nextLevelBtn.textContent = 'Start New Game';
        nextLevelBtn.onclick = function() { level = 1; initGame(); };
        restartLevelBtn.textContent = 'Restart Current Level';
        restartLevelBtn.onclick = function() { initGame(); };
    }
    
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
