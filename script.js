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

// Xal Dəyişənləri
const SCORE_MATCH = 100;
const SCORE_MISMATCH = -20;

// Emoji hovuzu (70 fərqli emoji) - Hər səviyyədə təsadüfi seçiləcək
const ALL_EMOJIS = [
    '🐶', '🐱', '🦊', '🐻', '🦁', '🐯', '🦄', '🐮', '🐷', '🐵', 
    '🦉', '🐸', '🍎', '🍊', '🍋', '🍇', '🍉', '🍓', '🍒', '🍑', 
    '🥝', '🍍', '🥥', '🥑', '🚗', '🚕', '🚌', '🚓', '🚑', '🚒', 
    '🚚', '🚢', '🚀', '🚁', '🚂', '🛸', '⌚', '📱', '💻', '🖥️', 
    '🔑', '🔒', '🔓', '🎲', '🧩', '🎈', '🎁', '🎂', '👑', '💍',
    '🌞', '🌛', '⭐', '🌈', '🔥', '💧', '🌿', '🍄', '🔔', '📚',
    '🔬', '🔭', '💰', '💳', '📧', '💡', '📌', '📎', '💉', '💊' 
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

// Gecikməsiz Səs Oynatma Funksiyası (Audio Elementinin Klonlanması)
function playSound(audioElement) {
    if (!audioElement) return;
    const clone = audioElement.cloneNode();
    clone.volume = 0.5;
    clone.play();
}

// Oyunu Başlat
function startGame() {
    initGame();
}

// Oyunu sıfırla və başla
function initGame() {
    clearInterval(timerInterval);

    // Səviyyəyə görə kart sayını təyin et
    if (level === 1) totalPairs = 6; // 12 kart
    else if (level === 2) totalPairs = 8; // 16 kart
    else if (level >= MAX_LEVEL) totalPairs = 10; // 20 kart (Maksimum)
    
    // Sıfırlamalar
    memoryBoard.innerHTML = '';
    moves = 0;
    matchedPairs = 0;
    // Xal yalnız level 1-dən başlananda sıfırlansın
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
    timerDisplay.style.color = 'inherit'; // Rəngi sıfırla
    
    createCards();
    startTimer();
    adContainer.classList.add('hidden');
}

// Limitsiz Vaxt Sayğacı 
function startTimer() {
    timerInterval = setInterval(() => {
        timeElapsed++;
        timerDisplay.textContent = formatTime(timeElapsed);
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
    
    // EMOJİ MƏNTİQİ: Hər səviyyədə təsadüfi yeni emojilər
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

// Oyun Bitdi Paneli
function handleGameOver(isSuccess) {
    lockBoard = true;

    finalMovesDisplay.textContent = moves;
    finalScoreDisplay.textContent = score;
    
    const adTitle = document.getElementById('ad-title');
    const finalMessage = document.querySelector('.final-message');
    const nextLevelBtn = document.getElementById('next-level');
    const restartLevelBtn = document.getElementById('restart-level'); // Yenilənmiş düymə

    if (isSuccess) {
        playSound(winSound);
        
        if (level < MAX_LEVEL) {
            adTitle.textContent = 'Təbriklər! 🎉 Səviyyə Keçildi!';
            finalMessage.textContent = `Növbəti səviyyədə ${totalPairs + 2} cütlük olacaq.`;

            // Əsas düymə: Növbəti Səviyyə
            nextLevelBtn.textContent = `Növbəti Səviyyə (${level + 1})`;
            nextLevelBtn.onclick = function() { level++; initGame(); };
            nextLevelBtn.style.display = 'block'; 

            // İkinci düymə: Təkrar Oyna
            restartLevelBtn.style.display = 'block';

        } else {
            adTitle.textContent = 'Oyun Bitdi! 🏆 Ən Yüksək Nəticə!';
            finalMessage.textContent = `Bütün səviyyələri ${score} xalla tamamladınız.`;
            
            // Əsas düymə: Yenidən Başla (Çünki başqa level yoxdur)
            nextLevelBtn.textContent = 'Yenidən Başla';
            nextLevelBtn.onclick = function() { level = 1; initGame(); }; 

            // İkinci düyməni (Təkrar Oyna) gizlədirik, çünki əsas düymə eyni funksiyanı yerinə yetirir
            restartLevelBtn.style.display = 'none'; 
        }
    } 
    
    document.getElementById('restart-level').onclick = function() {
        initGame(); // Cari səviyyəni yenidən başlat
    };

    // Reklam bloku (Placeholder)
    document.getElementById('ad-content').innerHTML = `
        <div class="ad-iframe-container">
            <p>Reklamınız burada görünəcək.</p>
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
