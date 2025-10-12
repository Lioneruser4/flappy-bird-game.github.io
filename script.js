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
    '🚚', '🚢', '🚀', '🚁', '🚂', '⌚', '📱', '💻', '🖥️', 
    '🔑', '🔒', '🔓', '🎲', '🧩', '🎈', '🎁', '🎂', '👑', '💍',
    '🌞', '🌛', '⭐', '🌈', '🔥', '💧', '🌿', '🍄', '🔔', '📚',
    '🔬', '🔭', '💰', '💳', '📧', '💡', '📌', '📎', '💉', '💊' 
];

// DOM elementləri və Səslər
let memoryBoard, movesDisplay, matchedDisplay, timerDisplay, scoreDisplay, adContainer, finalMovesDisplay, finalScoreDisplay, currentLevelDisplay, themeIcon;
let flipSound, matchSound, mismatchSound, winSound, gameoverSound;
let onlineUsersDisplay; 

// PubNub Dəyişənləri
let pubnub;
const PUBNUB_CHANNEL = 'memory_game_online'; 

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
    onlineUsersDisplay = document.getElementById('online-users');
    
    // Səs elementlərini seç
    flipSound = document.getElementById('flip-sound');
    matchSound = document.getElementById('match-sound');
    mismatchSound = document.getElementById('mismatch-sound');
    winSound = document.getElementById('win-sound');
    gameoverSound = document.getElementById('gameover-sound');

    // Düymə hadisələri
    document.getElementById('restart-button').addEventListener('click', function() {
        level = 1; // Baş düymə hər zaman 1-ci səviyyədən başlasın
        // Hangi oyun aktifse onu başlatmalı (şimdilik sadece memory game)
        initGame();
    });
    document.getElementById('theme-toggle-button').addEventListener('click', toggleDarkMode);

    // Tema rejimini yoxla
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.textContent = '☀️';
    }
    
    initPubNub();

    // OYUN SEÇİM MANTIKLARI
    const gameSelection = document.getElementById('gameSelection');
    const memoryGameContainer = document.getElementById('memoryGameContainer');

    document.getElementById('selectMemoryGame').addEventListener('click', function() {
        gameSelection.classList.add('hidden');
        memoryGameContainer.classList.remove('hidden');
        // Oyun başlığını eski haline getir
        document.querySelector('#game-area h1').innerHTML = ` Eyni Emojini Tap <span id="current-level">(Səviyyə ${level})</span>`;
        startGame(); // Hafıza oyununu başlatır
    });

    document.getElementById('selectEmojiCrush').addEventListener('click', function() {
        gameSelection.classList.add('hidden');
        memoryGameContainer.classList.remove('hidden');
        // Yeni oyunu başlatır (emojiCrush.js içinde tanımlı)
        startEmojiCrush();
    });
});

// PubNub Bağlantısı ve Canlı Sayğac Məntiqi (AYNI KALDI)
function initPubNub() {
    // ... (PubNub Kodu Aynı Kaldı) ...
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


// Gecikməsiz Səs Oynatma Funksiyası (AYNI KALDI)
function playSound(audioElement) {
    if (!audioElement) return;
    const clone = audioElement.cloneNode();
    clone.volume = 0.5;
    clone.play();
}

// Oyunu Başlat (Eyni Emojini Tap)
function startGame() {
    initGame();
}

// Oyunu sıfırla və başla (Eyni Emojini Tap) (AYNI KALDI)
function initGame() {
    clearInterval(timerInterval);

    if (level === 1) totalPairs = 6; 
    else if (level === 2) totalPairs = 8; 
    else if (level >= MAX_LEVEL) totalPairs = 10; 
    
    memoryBoard.innerHTML = '';
    moves = 0;
    matchedPairs = 0;
    if (level === 1) score = 0; 
    timeElapsed = 0;
    lockBoard = false;
    hasFlippedCard = false;
    firstCard = null;
    secondCard = null;

    movesDisplay.textContent = moves;
    scoreDisplay.textContent = score;
    document.getElementById('total-pairs').textContent = totalPairs;
    matchedDisplay.textContent = matchedPairs;
    currentLevelDisplay.textContent = `(Səviyyə ${level})`;
    timerDisplay.textContent = formatTime(timeElapsed);
    timerDisplay.style.color = 'inherit'; 
    
    createCards();
    startTimer();
    adContainer.classList.remove('show');
    adContainer.classList.add('hidden');
}

// ... (Geri kalan tüm hafıza oyunu fonksiyonları AYNI KALDI: startTimer, formatTime, createCards, flipCard, checkForMatch, disableCards, unflipCards, resetBoard, handleGameOver, shuffleArray, toggleDarkMode) ...

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
    memoryBoard.className = 'memory-board';
    if (totalPairs === 6) memoryBoard.classList.add('grid-4x3');
    else if (totalPairs === 8) memoryBoard.classList.add('grid-4x4');
    else if (totalPairs === 10) memoryBoard.classList.add('grid-4x5');
    
    const shuffledEmojis = shuffleArray([...ALL_EMOJIS]);
    const selectedEmojis = shuffledEmojis.slice(0, totalPairs); 
    const gameCards = selectedEmojis.flatMap(emoji => [emoji, emoji]);
    shuffleArray(gameCards);
    
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
    const restartLevelBtn = document.getElementById('restart-level');
    const adContent = document.getElementById('ad-content'); 

    if (isSuccess) {
        playSound(winSound);
        
        if (level < MAX_LEVEL) {
            adTitle.textContent = 'Təbriklər! 🎉 Səviyyə Keçildi!';
            finalMessage.textContent = `Növbəti səviyyədə ${totalPairs + 2} cütlük olacaq.`;

            nextLevelBtn.textContent = `Növbəti Səviyyə (${level + 1})`;
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
            adTitle.textContent = 'Oyun Bitdi! 🏆 Ən Yüksək Nəticə!';
            finalMessage.textContent = `Bütün çətinlikləri ${score} xalla tamamladınız. Yenidən oyna!`;
            
            nextLevelBtn.textContent = 'Eyni Səviyyəni Yenidən Başla'; 
            nextLevelBtn.onclick = null;
            nextLevelBtn.onclick = function() { 
                adContainer.classList.remove('show'); 
                adContainer.classList.add('hidden');
                initGame(); 
            }; 

            restartLevelBtn.style.display = 'none'; 
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

// Dizi qarışdırma funksiyası (AYNI KALDI)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Gece/Gündüz Rejimi (AYNI KALDI)
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


// YENİ OYUN BAŞLATMA FONKSİYONU (EMOJI CRUSH)
function startEmojiCrush() {
    // Hafıza oyunundaki gereksiz zamanlayıcıyı durdur
    clearInterval(timerInterval);
    
    // Oyun başlığını değiştir
    document.querySelector('#game-area h1').innerHTML = `💥 Emoji Crush <span id="current-level">(Səviyyə 1)</span>`;
    
    // Skor ve hareket alanlarını yeni oyun için hazırla
    document.getElementById('moves').textContent = '0'; // Hamle Sayısı
    document.getElementById('matched').textContent = '0'; // Patlama Sayısı (Örn)
    document.getElementById('total-pairs').textContent = '30'; // Kalan Hamle/Süre
    document.getElementById('timer').textContent = '00:00'; 
    document.getElementById('score').textContent = '0';
    
    // Oyun tahtasını temizle ve Crush oyunu için bir alan hazırla
    memoryBoard.className = 'crush-board';
    memoryBoard.innerHTML = `
        <div id="emoji-crush-grid">
            <h2>Emoji Crush Yüklənir...</h2>
            <p>Bu alan, **emojiCrush.js** dosyasındaki kodlarla dolacak.</p>
            <p><strong>Lütfen 'emojiCrush.js' dosyasını oluşturun.</strong></p>
        </div>
    `;

    // Bu noktada, eğer 'emojiCrush.js' dosyası varsa, içerisindeki initCrushGame() 
    // gibi bir fonksiyonu çağırmanız gerekir.
    if (typeof initCrushGame === 'function') {
        initCrushGame();
    }
}
