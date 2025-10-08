// Oyun dəyişənləri
let cards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let matchedPairs = 0;
const totalPairs = 6; // 12 kart (6 cüt)
let level = 1;

// Emoji seti (hər səviyyə üçün fərqli emojilər istifadə etmək üçün genişləndirildi)
const allEmojis = [
    ['🐶', '🐱', '🦊', '🐻', '🦁', '🐯', '🦄', '🐮', '🐷', '🐵', '🦉', '🐸'],
    ['🍎', '🍊', '🍋', '🍇', '🍉', '🍓', '🍒', '🍑', '🥝', '🍍', '🥥', '🥑'],
    ['🚗', '🚕', '🚌', '🚓', '🚑', '🚒', '🚚', '🚢', '🚀', '🚁', '🚂', '🛸']
];
let currentEmojis = allEmojis[0];

// DOM elementləri
let memoryBoard, movesDisplay, matchedDisplay, restartButton, gameAreaDiv, adContainer, finalMovesDisplay;

// Səviyyəyə görə emoji dəstini seçir
function getEmojisForLevel(lvl) {
    const index = (lvl - 1) % allEmojis.length; // Emoji dəstləri arasında dövr edir
    return allEmojis[index];
}

// Səhifə yükləndikdə oyunu başlat
document.addEventListener('DOMContentLoaded', function() {
    // Elementləri seç
    gameAreaDiv = document.getElementById('game-area');
    memoryBoard = document.getElementById('memory-board');
    restartButton = document.getElementById('restart-button');
    movesDisplay = document.getElementById('moves');
    matchedDisplay = document.getElementById('matched');
    const totalPairsDisplay = document.getElementById('total-pairs');
    adContainer = document.getElementById('ad-container');
    finalMovesDisplay = document.getElementById('final-moves');

    // Başlanğıc dəyərləri təyin et
    if (totalPairsDisplay) totalPairsDisplay.textContent = totalPairs;
    
    // Oyun birbaşa başlayır, çünki Telegram girişi yoxdur
    startGame();
    
    // Yenidən başlat düyməsinə klik hadisəsi
    if (restartButton) {
        restartButton.addEventListener('click', initGame);
    }

    // Reklam panelinin düymələrinə klik hadisələri
    document.getElementById('next-level')?.addEventListener('click', function() {
        level++;
        adContainer.classList.add('hidden');
        initGame();
    });
    
    document.getElementById('restart-level')?.addEventListener('click', function() {
        adContainer.classList.add('hidden');
        initGame();
    });
});

// Oyunu başlat
function startGame() {
    if (gameAreaDiv) gameAreaDiv.classList.remove('hidden');
    initGame();
}

// Oyunu sıfırla və başla
function initGame() {
    currentEmojis = getEmojisForLevel(level);

    if (memoryBoard) memoryBoard.innerHTML = '';
    moves = 0;
    matchedPairs = 0;
    if (movesDisplay) movesDisplay.textContent = moves;
    if (matchedDisplay) matchedDisplay.textContent = matchedPairs;
    
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
    
    // Seçilmiş emojilərin cütlükləri
    const selectedEmojis = currentEmojis.slice(0, totalPairs);
    const gameCards = [];
    
    // Hər emojidən 2'şər əlavə et
    selectedEmojis.forEach(emoji => {
        gameCards.push(emoji, emoji);
    });
    
    // Kartları qarışdır
    shuffleArray(gameCards);
    
    // Kartları yarat və lövhəyə əlavə et
    gameCards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        
        // Kartın ön üzü rəngli, arxa üzü emojidir
        card.innerHTML = `
            <div class="front"></div>
            <div class="back">${emoji}</div>
        `;
        
        card.addEventListener('click', flipCard);
        memoryBoard.appendChild(card);
        cards.push(card);
    });
}

// Kart çevirmə əməliyyatı (Animationsız)
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    if (this.classList.contains('flipped')) return;

    // Animasiya: kartı çevir
    this.classList.add('flipped');
    
    if (!hasFlippedCard) {
        // İlk kart
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    
    // İkinci kart
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
        
        // Bütün cütlüklər tapıldı mı?
        if (matchedPairs === totalPairs) {
            setTimeout(showAd, 800); // Oyunu bitir və reklamı göstər
        }
    } else {
        unflipCards();
    }
}

// Eşləşən kartları qeyd et
function disableCards() {
    // Animasiya: Eşləşmə effekti
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
        // Animasiya: Geri çevirmə effekti
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

// Reklam panelini göstər
function showAd() {
    if (!adContainer || !finalMovesDisplay) return;

    finalMovesDisplay.textContent = moves;

    const adContent = document.getElementById('ad-content');
    if (adContent) {
        // Reklam iframe-i yarat
        adContent.innerHTML = `
            <div class="ad-iframe-container">
                <iframe src="https://www.effectivegatecpm.com/jmxtn13f4u?key=f0d62284f1985ef0201e08b24c1191f6" 
                        style="width:100%; height:250px; border:none; border-radius:10px;"
                        sandbox="allow-scripts allow-same-origin allow-popups">
                </iframe>
            </div>
        `;
    }

    adContainer.classList.remove('hidden');
    adContainer.classList.add('show'); // Animasiya üçün sinif əlavə et
}

// Kart yaratma funksiyasında kartın ön (front) hissəsini boş saxlayın
// və yalnız arxa (back) hissəsinə emojini qoyun.
// Bu, kartın tək rəng olmasını və çevriləndə emojini göstərməsini təmin edir.
