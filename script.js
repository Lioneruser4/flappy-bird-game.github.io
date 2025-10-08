// Oyun dəyişənləri
let cards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let matchedPairs = 0;
let totalPairs = 6;
let level = 1;
const MAX_LEVEL = 3; // Maksimum 3 səviyyə (20 kart)

// Emoji hovuzu (50 fərqli emoji) - Hər səviyyədə təsadüfi seçiləcək
const ALL_EMOJIS = [
    '🐶', '🐱', '🦊', '🐻', '🦁', '🐯', '🦄', '🐮', '🐷', '🐵', 
    '🦉', '🐸', '🍎', '🍊', '🍋', '🍇', '🍉', '🍓', '🍒', '🍑', 
    '🥝', '🍍', '🥥', '🥑', '🚗', '🚕', '🚌', '🚓', '🚑', '🚒', 
    '🚚', '🚢', '🚀', '🚁', '🚂', '🛸', '⌚', '📱', '💻', '🖥️', 
    '🔑', '🔒', '🔓', '🎲', '🧩', '🎈', '🎁', '🎂', '👑', '💍'
];

// DOM elementləri
let memoryBoard, movesDisplay, matchedDisplay, restartButton, adContainer, finalMovesDisplay, currentLevelDisplay, themeIcon;

// Sayfa yükləndikdə oyunu başlat
document.addEventListener('DOMContentLoaded', function() {
    // Elementləri seç
    memoryBoard = document.getElementById('memory-board');
    restartButton = document.getElementById('restart-button');
    movesDisplay = document.getElementById('moves');
    matchedDisplay = document.getElementById('matched');
    adContainer = document.getElementById('ad-container');
    finalMovesDisplay = document.getElementById('final-moves');
    currentLevelDisplay = document.getElementById('current-level');
    themeIcon = document.getElementById('theme-icon');
    const themeToggleButton = document.getElementById('theme-toggle-button');
    
    // Başlanğıc parametrlər
    startGame();
    
    // Düymə hadisələri
    if (restartButton) restartButton.addEventListener('click', initGame);
    if (themeToggleButton) themeToggleButton.addEventListener('click', toggleDarkMode);

    // Tema rejimini yoxla (əvvəlki seçimi yadda saxlamaq üçün)
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.textContent = '☀️';
    }
});

// Oyunu başlat
function startGame() {
    initGame();
}

// Oyunu sıfırla və başla
function initGame() {
    // Səviyyəyə görə kart sayını təyin et
    if (level === 1) totalPairs = 6; // 12 kart
    else if (level === 2) totalPairs = 8; // 16 kart
    else if (level >= MAX_LEVEL) totalPairs = 10; // 20 kart
    
    // DOM yeniləmələri
    if (memoryBoard) memoryBoard.innerHTML = '';
    moves = 0;
    matchedPairs = 0;
    if (movesDisplay) movesDisplay.textContent = moves;
    document.getElementById('total-pairs').textContent = totalPairs;
    if (matchedDisplay) matchedDisplay.textContent = matchedPairs;
    if (currentLevelDisplay) currentLevelDisplay.textContent = `(Səviyyə ${level})`;
    
    cards = [];
    lockBoard = false;
    hasFlippedCard = false;
    firstCard = null;
    secondCard = null;
    
    // Kartları yarat
    createCards();
}

// Kartları yarat
function createCards() {
    if (!memoryBoard) return;
    
    // Kart qrafikini və ölçülərini səviyyəyə görə təyin et
    memoryBoard.className = 'memory-board';
    if (totalPairs === 6) memoryBoard.classList.add('grid-4x3');
    else if (totalPairs === 8) memoryBoard.classList.add('grid-4x4');
    else if (totalPairs === 10) memoryBoard.classList.add('grid-4x5'); // 4 sütun 5 sıradan ibarət 20 kart
    
    // Emoji hovuzundan təsadüfi seçilmiş emojiləri götür (hər dəfə fərqli olsun)
    const shuffledEmojis = shuffleArray([...ALL_EMOJIS]);
    const selectedEmojis = shuffledEmojis.slice(0, totalPairs);
    
    const gameCards = [];
    selectedEmojis.forEach(emoji => {
        gameCards.push(emoji, emoji);
    });
    
    shuffleArray(gameCards);
    
    // Kart elementlərini yarat
    gameCards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        
        card.innerHTML = `
            <div class="front"></div>
            <div class="back">${emoji}</div>
        `;
        
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

    this.classList.add('flipped');
    
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    
    secondCard = this;
    moves++;
    if (movesDisplay) movesDisplay.textContent = moves;
    
    checkForMatch();
}

// Eşləşməni yoxla
function checkForMatch() {
    const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
    
    if (isMatch) {
        disableCards();
        matchedPairs++;
        if (matchedDisplay) matchedDisplay.textContent = `${matchedPairs}/${totalPairs}`;
        
        if (matchedPairs === totalPairs) {
            setTimeout(showAd, 800);
        }
    } else {
        unflipCards();
    }
}

// Eşləşən kartları qeyd et və açıq saxla
function disableCards() {
    // Eşləşən kartlar 'flipped' sinfində qalır və əlavə olaraq 'matched' sinfi alır
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    
    // Klik hadisəsini aradan qaldırırıq ki, təkrar çevrilməsin
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    resetBoard();
}

// Eşləşməyən kartları geri çevir
function unflipCards() {
    lockBoard = true;
    
    setTimeout(() => {
        // Uyğun gəlməyən kartlardan 'flipped' sinfini silir
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

// Dizi qarışdırma funksiyası
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Reklam panelini göstər və səviyyə keçidini idarə et
function showAd() {
    if (!adContainer || !finalMovesDisplay) return;

    finalMovesDisplay.textContent = moves;

    const adContent = document.getElementById('ad-content');
    if (adContent) {
        // Reklam iframe-i
        adContent.innerHTML = `
            <div class="ad-iframe-container">
                <iframe src="https://www.effectivegatecpm.com/jmxtn13f4u?key=f0d62284f1985ef0201e08b24c1191f6" 
                        style="width:100%; height:250px; border:none; border-radius:10px;"
                        sandbox="allow-scripts allow-same-origin allow-popups">
                </iframe>
            </div>
        `;
    }
    
    const nextLevelBtn = document.getElementById('next-level');

    if (level < MAX_LEVEL) {
        nextLevelBtn.textContent = `Növbəti Səviyyə (${level + 1})`;
        nextLevelBtn.onclick = function() {
            level++;
            adContainer.classList.remove('show');
            adContainer.classList.add('hidden');
            initGame();
        };
    } else {
        nextLevelBtn.textContent = 'Ən Yüksək Səviyyəni Təkrarla';
        nextLevelBtn.onclick = function() {
            adContainer.classList.remove('show');
            adContainer.classList.add('hidden');
            // Eyni (max) səviyyəni yenidən başlat
            initGame();
        };
    }
    
    document.getElementById('restart-level').onclick = function() {
        // Cari səviyyəni yenidən başlat
        adContainer.classList.remove('show');
        adContainer.classList.add('hidden');
        initGame();
    };

    adContainer.classList.remove('hidden');
    adContainer.classList.add('show');
}

// Gece/Gündüz Rejimi
function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    if (isDark) {
        localStorage.setItem('theme', 'dark');
        themeIcon.textContent = '☀️'; // Gündüz rejiminə keçid üçün ikona
    } else {
        localStorage.setItem('theme', 'light');
        themeIcon.textContent = '🌙'; // Gece rejiminə keçid üçün ikona
    }
}
