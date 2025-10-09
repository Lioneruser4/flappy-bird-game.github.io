// Oyun dəyişənləri
let cards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let matchedPairs = 0;
let totalPairs = 6;
let level = 1;
const MAX_LEVEL = 3; 
let score = 0;

// Vaxt Dəyişənləri
let timerInterval;
let timeElapsed = 0; 
const SCORE_MATCH = 100;
const SCORE_MISMATCH = -20;

// Emoji hovuzu (70 fərqli emoji) - Kodu qısaltmaq üçün yuxarıdakı listi təkrar etmirəm.
const ALL_EMOJIS = [
    '🐶', '🐱', '🦊', '🐻', '🦁', '🐯', '🦄', '🐮', '🐷', '🐵', 
    '🦉', '🐸', '🍎', '🍊', '🍋', '🍇', '🍉', '🍓', '🍒', '🍑', 
    '🥝', '🍍', '🥥', '🥑', '🚗', '🚕', '🚌', '🚓', '🚑', '🚒', 
    '🚚', '🚢', '🚀', '🚁', '🚂', '⌚', '📱', '💻', '🖥️', 
    '🔑', '🔒', '🔓', '🎲', '🧩', '🎈', '🎁', '🎂', '👑', '💍',
    '🌞', '🌛', '⭐', '🌈', '🔥', '💧', '🌿', '🍄', '🔔', '📚',
    '🔬', '🔭', '💰', '💳', '📧', '💡', '📌', '📎', '💉', '💊' 
];

// DOM elementləri və Səslər
let memoryBoard, movesDisplay, matchedDisplay, timerDisplay, scoreDisplay, adContainer, finalMovesDisplay, finalScoreDisplay, currentLevelDisplay, themeIcon, gameArea;
let flipSound, matchSound, mismatchSound, winSound, gameoverSound;
let onlineUsersDisplay; 
let pubnub;
const PUBNUB_CHANNEL = 'memory_game_online'; 

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elementlərini Seç
    gameArea = document.getElementById('game-area'); 
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
    
    // Səs elementlərini seç (preload="auto" index.html-də olmalıdır)
    flipSound = document.getElementById('flip-sound');
    matchSound = document.getElementById('match-sound');
    mismatchSound = document.getElementById('mismatch-sound');
    winSound = document.getElementById('win-sound');
    gameoverSound = document.getElementById('gameover-sound');

    document.getElementById('restart-button').addEventListener('click', function() {
        level = 1; 
        initGame();
    });
    document.getElementById('theme-toggle-button').addEventListener('click', toggleDarkMode);

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.textContent = '☀️';
    }
    
    initPubNub(); // PubNub açarlarınızı dəyişməyi unutmayın!
    startGame();
});

// PubNub kodları eyni qalır

// ⭐ ƏSAS DÜZƏLİŞ: Səs Gecikməsi Həlli (Audio Klonlama) ⭐
function playSound(audioElement) {
    if (!audioElement) return;
    const clone = audioElement.cloneNode(); // Elementi klonlayırıq
    clone.volume = 0.5;
    clone.play(); // Klonu oynadırıq
}

function startGame() {
    initGame();
}

function initGame() {
    clearInterval(timerInterval);

    // Düzgün Səviyyə Məntiqi
    if (level === 1) totalPairs = 6;
    else if (level === 2) totalPairs = 8;
    else if (level >= MAX_LEVEL) totalPairs = 10;
    
    // Sıfırlamalar
    memoryBoard.innerHTML = '';
    cards = []; 
    moves = 0;
    matchedPairs = 0;
    if (level === 1) score = 0; 
    timeElapsed = 0;
    lockBoard = false;
    hasFlippedCard = false;
    firstCard = null;
    secondCard = null;

    // DOM yeniləmələri
    movesDisplay.textContent = moves;
    scoreDisplay.textContent = score;
    document.getElementById('total-pairs').textContent = totalPairs;
    matchedDisplay.textContent = matchedPairs;
    currentLevelDisplay.textContent = `(Səviyyə ${level})`;
    timerDisplay.textContent = formatTime(timeElapsed);
    
    createCards();
    startTimer();

    // Oyun sahəsini göstər
    gameArea.style.display = 'block'; 
    adContainer.style.display = 'none'; 
}

// ... (Timer, formatTime, createCards funksiyaları eyni qalır) ...

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

function checkForMatch() {
    const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
    
    if (isMatch) {
        score += SCORE_MATCH;
        scoreDisplay.textContent = score;

        playSound(matchSound);
        disableCards();
        matchedPairs++;
        matchedDisplay.textContent = `${matchedPairs}/${totalPairs}`;
        
        // ⭐ NÖVBƏTİ SƏVİYYƏ KEÇİDİNİN YOXLANILMASI
        if (matchedPairs === totalPairs) {
            clearInterval(timerInterval);
            // Kartların partlama animasiyasının bitməsini gözlə
            setTimeout(() => {
                handleGameOver(true);
            }, 600); 
        }
    } else {
        score += SCORE_MISMATCH;
        if (score < 0) score = 0; 
        scoreDisplay.textContent = score;

        playSound(mismatchSound);
        firstCard.classList.add('shake');
        secondCard.classList.add('shake');
        
        setTimeout(() => {
            firstCard.classList.remove('shake');
            secondCard.classList.remove('shake');
            unflipCards();
        }, 350); 
    }
}

// ... (disableCards, unflipCards, resetBoard funksiyaları eyni qalır) ...

function handleGameOver(isSuccess) {
    lockBoard = true;
    playSound(winSound);

    gameArea.style.display = 'none'; 
    adContainer.style.display = 'block'; 

    finalMovesDisplay.textContent = moves;
    finalScoreDisplay.textContent = score;
    
    const adTitle = document.getElementById('ad-title');
    const finalMessage = document.querySelector('.final-message');
    const nextLevelBtn = document.getElementById('next-level');
    const restartLevelBtn = document.getElementById('restart-level');
    const adContent = document.getElementById('ad-content'); 

    if (level < MAX_LEVEL) {
        adTitle.textContent = 'Təbriklər! 🎉 Səviyyə Keçildi!';
        finalMessage.textContent = `Xal: ${score} | Növbəti səviyyədə ${totalPairs + 2} cütlük olacaq.`;
        nextLevelBtn.textContent = `Növbəti Səviyyə (${level + 1})`;
        restartLevelBtn.style.display = 'block';

    } else {
        adTitle.textContent = 'Oyun Bitdi! 🏆 Ən Yüksək Nəticə!';
        finalMessage.textContent = `Bütün çətinlikləri ${score} xalla tamamladınız. Yenidən oyna!`;
        nextLevelBtn.textContent = 'Eyni Səviyyəni Yenidən Başla'; 
        restartLevelBtn.style.display = 'none'; 
    }
    
    // Növbəti Səviyyə Düyməsi
    nextLevelBtn.onclick = function() { 
        if (level < MAX_LEVEL) {
            level++;
        }
        initGame(); 
    };

    // Təkrar Oyna Düyməsi
    restartLevelBtn.onclick = function() {
        initGame(); 
    };

    // Reklam Blokları (Əvvəlki cavabda təqdim etdiyiniz kodlar)
    adContent.innerHTML = `
        <div class="ad-iframe-container" style="text-align: center; margin: 20px 0;">
            <div style="margin-bottom: 20px;">
                <script type='text/javascript' src='//pl27817770.effectivegatecpm.com/5d/b8/3f/5db83f02b180dc8f2699fba7459b6382.js'></script>
            </div>
            
            <div style="margin-bottom: 20px;">
                <script type='text/javascript' src='//pl27817788.effectivegatecpm.com/91/a1/d1/91a1d1bda43a3aa15888917200b9e931.js'></script>
            </div>
        </div>
    `;
}

// ... (shuffleArray, toggleDarkMode funksiyaları eyni qalır) ...
