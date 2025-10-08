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
const LEVEL_TIME_LIMITS = { 1: 60, 2: 90, 3: 120 }; // Saniyə ilə vaxt limitləri

// Xal Dəyişənləri
const SCORE_MATCH = 100;
const SCORE_MISMATCH = -20;

// Emoji hovuzu (50 fərqli emoji)
const ALL_EMOJIS = [
    '🐶', '🐱', '🦊', '🐻', '🦁', '🐯', '🦄', '🐮', '🐷', '🐵', 
    '🦉', '🐸', '🍎', '🍊', '🍋', '🍇', '🍉', '🍓', '🍒', '🍑', 
    '🥝', '🍍', '🥥', '🥑', '🚗', '🚕', '🚌', '🚓', '🚑', '🚒', 
    '🚚', '🚢', '🚀', '🚁', '🚂', '🛸', '⌚', '📱', '💻', '🖥️', 
    '🔑', '🔒', '🔓', '🎲', '🧩', '🎈', '🎁', '🎂', '👑', '💍'
];

// DOM elementləri və Səslər
let memoryBoard, movesDisplay, matchedDisplay, timerDisplay, scoreDisplay, adContainer, finalMovesDisplay, finalScoreDisplay, currentLevelDisplay, themeIcon;
let flipSound, matchSound, mismatchSound, winSound, gameoverSound;

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elementlərini Seç
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
    
    // Səs elementlərini seç
    flipSound = document.getElementById('flip-sound');
    matchSound = document.getElementById('match-sound');
    mismatchSound = document.getElementById('mismatch-sound');
    winSound = document.getElementById('win-sound');
    gameoverSound = document.getElementById('gameover-sound');

    // Düymə hadisələri
    document.getElementById('restart-button').addEventListener('click', initGame);
    document.getElementById('theme-toggle-button').addEventListener('click', toggleDarkMode);

    // Tema rejimini yoxla
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.textContent = '☀️';
    }
    
    startGame();
});

// Gecikməsiz Səs Oynatma Funksiyası (Sürətli klonlama ilə)
function playSound(audioElement) {
    if (!audioElement) return;
    const clone = audioElement.cloneNode();
    clone.play();
}

// Oyunu Başlat
function startGame() {
    initGame();
}

// Oyunu sıfırla və başla
function initGame() {
    clearInterval(timerInterval); // Əvvəlki sayğacı dayandır

    // Səviyyəyə görə kart sayını təyin et
    if (level === 1) totalPairs = 6;
    else if (level === 2) totalPairs = 8;
    else if (level >= MAX_LEVEL) totalPairs = 10;
    
    // Sıfırlamalar
    memoryBoard.innerHTML = '';
    moves = 0;
    matchedPairs = 0;
    score = 0;
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
    timerDisplay.textContent = formatTime(LEVEL_TIME_LIMITS[level]);
    
    createCards();
    startTimer();
    adContainer.classList.add('hidden'); // Reklamı gizlət
}

// Vaxt Sayğacı
function startTimer() {
    let timeLeft = LEVEL_TIME_LIMITS[level];
    timerDisplay.textContent = formatTime(timeLeft);

    timerInterval = setInterval(() => {
        timeLeft--;
        timeElapsed++;
        timerDisplay.textContent = formatTime(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleGameOver(false); // Vaxt bitdi, Game Over
        }
    }, 1000);
}

// Vaxtı Dəqiqə:Saniyə formatına çevirir
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}

// Kartları yarat
function createCards() {
    // Kart qrafikini və ölçülərini səviyyəyə görə təyin et
    memoryBoard.className = 'memory-board';
    if (totalPairs === 6) memoryBoard.classList.add('grid-4x3');
    else if (totalPairs === 8) memoryBoard.classList.add('grid-4x4');
    else if (totalPairs === 10) memoryBoard.classList.add('grid-4x5');
    
    // Emoji seçimi və qarışdırılması eyni qalır
    const shuffledEmojis = shuffleArray([...ALL_EMOJIS]);
    const selectedEmojis = shuffledEmojis.slice(0, totalPairs);
    const gameCards = selectedEmojis.flatMap(emoji => [emoji, emoji]);
    shuffleArray(gameCards);
    
    // Kart elementlərini yarat
    gameCards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        
        card.innerHTML = `<div class="front"></div><div class="back">${emoji}</div>`;
        card.addEventListener('click', flipCard);
        memoryBoard.appendChild(card);
        cards.push(card);
    });
}

// Kart çevirmə əməliyyatı
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    if (this.classList.contains('flipped')) return;

    // Kart çevrilmə səsi
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

// Eşləşməni yoxla
function checkForMatch() {
    const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
    
    if (isMatch) {
        // Xal əlavə et
        score += SCORE_MATCH;
        scoreDisplay.textContent = score;

        playSound(matchSound);
        disableCards();
        matchedPairs++;
        matchedDisplay.textContent = `${matchedPairs}/${totalPairs}`;
        
        if (matchedPairs === totalPairs) {
            clearInterval(timerInterval);
            handleGameOver(true); // Uğurlu bitmə
        }
    } else {
        // Xal çıxar
        score += SCORE_MISMATCH;
        if (score < 0) score = 0; // Mənfi xal olmasın
        scoreDisplay.textContent = score;

        playSound(mismatchSound);
        unflipCards();
    }
}

// Eşləşən kartları qeyd et və açıq saxla (Animasiya ilə)
function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    resetBoard();
}

// Eşləşməyən kartları geri çevir
function unflipCards() {
    lockBoard = true;
    
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

// Oyun lövhəsini sıfırla
function resetBoard() {
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
}

// Game Over (Səviyyə Bitdi və ya Vaxt Bitdi)
function handleGameOver(isSuccess) {
    // Final Xalını Hesabla (vaxt bonusu əlavə etmək olar, amma sadəlik üçün hələlik yoxdur)

    finalMovesDisplay.textContent = moves;
    finalScoreDisplay.textContent = score;
    
    const adTitle = document.getElementById('ad-title');
    const finalMessage = document.querySelector('.final-message');
    const nextLevelBtn = document.getElementById('next-level');

    if (isSuccess) {
        playSound(winSound);
        adTitle.textContent = 'Təbriklər! 🎉 Səviyyə Keçildi!';
        finalMessage.textContent = `Vaxtında (${formatTime(timeElapsed)}) və ${moves} hərəkətdə bitirdiniz.`;

        if (level < MAX_LEVEL) {
            nextLevelBtn.textContent = `Növbəti Səviyyə (${level + 1})`;
            nextLevelBtn.onclick = function() { level++; initGame(); };
            nextLevelBtn.style.display = 'inline-block';
        } else {
            adTitle.textContent = 'Oyun Bitdi! 🏆 Ən Yüksək Nəticə!';
            finalMessage.textContent = `Bütün səviyyələri ${moves} hərəkətdə və ${formatTime(timeElapsed)} vaxtda tamamladınız.`;
            nextLevelBtn.textContent = 'Yenidən Başla';
            nextLevelBtn.onclick = function() { level = 1; initGame(); }; // 1-ci səviyyəyə qayıt
        }
    } else {
        // Vaxt bitdi (Time Over)
        playSound(gameoverSound);
        adTitle.textContent = 'Vaxt Bitdi! ⌛ Oyun Uduzdu!';
        finalMessage.textContent = `Təəssüf ki, kartları vaxtında tapa bilmədiniz. Təkrar cəhd edin.`;
        nextLevelBtn.style.display = 'none'; // Növbəti səviyyə düyməsini gizlət
    }
    
    document.getElementById('restart-level').onclick = function() {
        initGame(); // Cari səviyyəni yenidən başlat
    };

    // Reklam bloku
    document.getElementById('ad-content').innerHTML = `
        <div class="ad-iframe-container">
            <iframe src="https://www.effectivegatecpm.com/jmxtn13f4u?key=f0d62284f1985ef0201e08b24c1191f6" 
                    style="width:100%; height:250px; border:none; border-radius:10px;"
                    sandbox="allow-scripts allow-same-origin allow-popups">
            </iframe>
        </div>
    `;

    adContainer.classList.remove('hidden');
    adContainer.classList.add('show');
}

// Dizi qarışdırma funksiyası
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Gece/Gündüz Rejimi
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
