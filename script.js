// Game variables
let cards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let matchedPairs = 0;
let totalPairs = 6;
let level = 1;
const MAX_LEVEL = 5; // Maksimum seviyeyi 5 olarak sınırladım, daha sonra artırabilirsiniz.
let score = 0;
let multiplier = 1; // Yeni: Skor çarpanı
let skillAvailable = true; // Yeni: Beceri kartı kontrolü
let errorLimit = 3; // Yeni: Yanlış tahmin hakkı
let errorsMade = 0; // Yeni: Yapılan yanlış tahmin sayısı

// Time Variables
let timerInterval;
let timeElapsed = 0;

// Score Variables
const SCORE_MATCH = 100;
const SCORE_MISMATCH = -20;
const MAX_ERROR_LIMIT = 5; // Max hata hakkı

// SKILL Variables
const SKILL_EMOJI = '✨';
const SKILL_NAME = 'Skill';
const SKILL_BONUS = 200;

// Emoji pool (70 different emojis)
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
let flipSound, matchSound, mismatchSound, winSound, gameoverSound, skillSound; // skillSound eklendi
let onlineUsersDisplay, errorLimitDisplay, multiplierDisplay; // Yeni DOM elementleri

// PubNub Variables
let pubnub;
const PUBNUB_CHANNEL = 'memory_game_online'; // NOT: PubNub anahtarlarınızı güncellemeyi unutmayın!

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
    // Yeni elementler
    errorLimitDisplay = document.getElementById('error-limit');
    multiplierDisplay = document.getElementById('multiplier');

    // Select sound elements
    flipSound = document.getElementById('flip-sound');
    matchSound = document.getElementById('match-sound');
    mismatchSound = document.getElementById('mismatch-sound');
    winSound = document.getElementById('win-sound');
    gameoverSound = document.getElementById('gameover-sound');
    skillSound = document.getElementById('skill-sound'); // Yeni Ses

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
    
    // NOT: PubNub'ı kullanmak için anahtarlarınızı ayarlayın.
    // initPubNub(); 
    startGame();
});

// PubNub Connection and Live Counter Logic (PubNub'ı kullanmak istiyorsanız, bu fonksiyonu çağırın ve anahtarları doldurun)
function initPubNub() {
    // ... (Eski PubNub Kodunuz Buraya Gelebilir) ...
}

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
    else if (level === 4) { totalPairs = 12; errorLimit = 5; } // 24 kart (yeni grid 6x4 eklenmeli)
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
    skillAvailable = true;

    // DOM updates
    movesDisplay.textContent = moves;
    scoreDisplay.textContent = score;
    document.getElementById('total-pairs').textContent = totalPairs;
    matchedDisplay.textContent = matchedPairs;
    currentLevelDisplay.textContent = `(Level ${level})`;
    timerDisplay.textContent = formatTime(timeElapsed);
    // Yeni DOM güncellemeleri
    errorLimitDisplay.textContent = errorLimit - errorsMade;
    multiplierDisplay.textContent = `x${multiplier}`;
    multiplierDisplay.style.visibility = 'hidden';
    
    createCards();
    startTimer();
    adContainer.classList.remove('show');
    adContainer.classList.add('hidden');
}

// ... (formatTime, shuffleArray, toggleDarkMode fonksiyonları aynı kalır)

// Unlimited Time Counter
function startTimer() {
    timerInterval = setInterval(() => {
        timeElapsed++;
        timerDisplay.textContent = formatTime(timeElapsed);

        // Hata Sınırına Ulaşılırsa Oyunu Bitir
        if (errorsMade >= errorLimit) {
            clearInterval(timerInterval);
            handleGameOver(false); // Başarısız bitir
        }
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
    // Define card layout and sizes according to level (yeni 6x4 grid eklendi)
    memoryBoard.className = 'memory-board';
    if (totalPairs === 6) memoryBoard.classList.add('grid-4x3');
    else if (totalPairs === 8) memoryBoard.classList.add('grid-4x4');
    else if (totalPairs === 10) memoryBoard.classList.add('grid-4x5');
    else if (totalPairs === 12) memoryBoard.classList.add('grid-6x4'); // Yeni 6x4 grid

    
    // EMOJI LOGIC: Random new emojis for each level
    const shuffledEmojis = shuffleArray([...ALL_EMOJIS]);
    let selectedEmojis = shuffledEmojis.slice(0, totalPairs);
    let gameCards = selectedEmojis.flatMap(emoji => [emoji, emoji]);

    // Skill Kartı Ekleme
    if (skillAvailable) {
        // Kart sayısını tek yapmak için son kartı sil (Skill, bir eşi olmayan kart olmalı)
        if (gameCards.length % 2 === 0) gameCards.pop(); 
        gameCards.push(SKILL_EMOJI); // Skill kartını ekle
    }

    shuffleArray(gameCards);
    memoryBoard.innerHTML = '';
    cards = []; // Kart dizisini sıfırla

    // Kart Elementlerini Oluştur
    gameCards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        
        let backContent = (emoji === SKILL_EMOJI) ? `<span class="skill-text">${SKILL_NAME}</span>` : emoji;
        
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

    // SKILL KARTI TIKLAMASI
    if (this.dataset.emoji === SKILL_EMOJI && skillAvailable) {
        useSkill(this);
        return;
    }

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

// SKILL KULLANMA FONKSİYONU
function useSkill(skillCard) {
    playSound(skillSound); 
    skillCard.classList.add('matched'); // Skill kartını kapat
    skillCard.removeEventListener('click', flipCard);
    skillAvailable = false; // Skill sadece bir kez kullanılabilir
    score += SKILL_BONUS;
    scoreDisplay.textContent = score;

    // Skill Etkisi: Tüm kartları 1 saniyeliğine göster
    lockBoard = true;
    cards.forEach(card => {
        if (!card.classList.contains('matched') && !card.classList.contains('flipped')) {
             // Sadece kapalı ve eşleşmemiş kartları çevir
            card.classList.add('flipped', 'flash'); 
        }
    });

    setTimeout(() => {
        cards.forEach(card => {
            card.classList.remove('flipped', 'flash');
        });
        lockBoard = false;
        resetBoard();
    }, 1500); // 1.5 saniye sonra kapat
}

// Check for match
function checkForMatch() {
    const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
    
    if (isMatch) {
        // Eşleşme durumunda skor çarpanı (Multiplier) etkinleştirilir
        score += SCORE_MATCH * multiplier;
        multiplier++;
        multiplierDisplay.textContent = `x${multiplier}`;
        multiplierDisplay.classList.add('active'); // CSS animasyonunu tetikler

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
            // Hata limitine ulaşıldı
            handleGameOver(false);
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
    
    // Matched kartlara ekstra bir shake animasyonu ekleyelim
    firstCard.classList.add('match-success'); 
    secondCard.classList.add('match-success');
    
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    resetBoard();
}

// Flip back unmatched cards
function unflipCards() {
    lockBoard = true;
    
    // Mismatch kartlara hata animasyonu ekleyelim
    firstCard.classList.add('mismatch-fail');
    secondCard.classList.add('mismatch-fail');
    
    setTimeout(() => {
        firstCard.classList.remove('flipped', 'mismatch-fail');
        secondCard.classList.remove('flipped', 'mismatch-fail');
        resetBoard();
    }, 1200); // Animasyon süresi biraz artırıldı
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
    // ... (Eski handleGameOver kodunuz aynı kalabilir, sadece level kontrolü değişti)

    lockBoard = true;
    clearInterval(timerInterval);

    finalMovesDisplay.textContent = moves;
    finalScoreDisplay.textContent = score;
    
    const adTitle = document.getElementById('ad-title');
    const finalMessage = document.querySelector('.final-message');
    const nextLevelBtn = document.getElementById('next-level');
    const restartLevelBtn = document.getElementById('restart-level');
    
    if (isSuccess) {
        playSound(winSound);
        adTitle.textContent = 'Congratulations! 🎉 Level Passed!';
        
        if (level < MAX_LEVEL) {
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
        finalMessage.textContent = `You ran out of moves! Try again to beat Level ${level}.`;
        nextLevelBtn.textContent = 'Try Again';
        nextLevelBtn.onclick = function() { initGame(); };
    }
    
    restartLevelBtn.onclick = function() { initGame(); };

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
