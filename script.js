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
let memoryBoard, movesDisplay, matchedDisplay, timerDisplay, scoreDisplay, adContainer, finalMovesDisplay, finalScoreDisplay, currentLevelDisplay, themeIcon, gameArea;
let flipSound, matchSound, mismatchSound, winSound, gameoverSound;
let onlineUsersDisplay; 

// PubNub Dəyişənləri
let pubnub;
const PUBNUB_CHANNEL = 'memory_game_online'; 

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elementlərini Seç
    gameArea = document.getElementById('game-area'); // Yeni: Oyun Sahəsi
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
        initGame();
    });
    document.getElementById('theme-toggle-button').addEventListener('click', toggleDarkMode);

    // Tema rejimini yoxla
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.textContent = '☀️';
    }
    
    initPubNub();
    startGame();
});

// PubNub Bağlantısı və Canlı Sayğac Məntiqi
function initPubNub() {
    // AÇARLARI BURAYA DAXİL EDİN
    pubnub = new PubNub({
        publishKey: 'YOUR_PUB_KEY', // <-- Bunu öz açarınızla əvəz edin
        subscribeKey: 'YOUR_SUB_KEY', // <-- Bunu öz açarınızla əvəz edin
        userId: 'user-' + Math.random().toString(36).substring(2, 9) // Hər istifadəçi üçün unikal ID
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


// Gecikməsiz Səs Oynatma Funksiyası
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

    if (level === 1) totalPairs = 6;
    else if (level === 2) totalPairs = 8;
    else if (level >= MAX_LEVEL) totalPairs = 10;
    
    // Sıfırlamalar
    memoryBoard.innerHTML = '';
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
    timerDisplay.style.color = 'inherit'; 
    
    createCards();
    startTimer();

    // OYUNU GÖRÜNƏN, REKLAMI GİZLİ ET
    gameArea.classList.remove('hidden');
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

// Oyun Bitdi Paneli (Oyun Sahəsini Reklam Sahəsi ilə Əvəzləyir)
function handleGameOver(isSuccess) {
    lockBoard = true;
    playSound(winSound);

    // OYUN SAHƏSİNİ GİZLƏT, REKLAM SAHƏSİNİ GÖRÜNƏN ET
    gameArea.classList.add('hidden');
    adContainer.classList.remove('hidden');

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
    
    // NÖVBƏTİ SƏVİYYƏ DÜYMƏSİNİN HADİSƏSİ (Pop-under açılır və oyun başlayır)
    nextLevelBtn.onclick = function() { 
        // POP-UNDER/YÖNLƏNDİRMƏ REKLAMI YENİ PƏNCƏRƏDƏ AÇILIR
        window.open('https://www.effectivegatecpm.com/wdznna3e2d?key=a54007a9d8c91e5fa15cc9207dc46158', '_blank');

        // Səviyyəni artır (maksimuma çatmayıbsa)
        if (level < MAX_LEVEL) {
            level++;
        }
        initGame(); 
    };

    // TƏKRAR OYNA DÜYMƏSİNİN HADİSƏSİ (Pop-under yoxdur, eyni səviyyə)
    restartLevelBtn.onclick = function() {
        initGame(); // Cari səviyyəni yenidən başlat
    };

    // ------------------------------------------------------------------
    // ⭐ BÜTÜN REKLAMLAR BURAYA YÜKLƏNİR ⭐
    // ad-content div-i artıq görünən olduğundan, reklamlar da görünəcək.
    // ------------------------------------------------------------------
    adContent.innerHTML = `
        <div class="ad-iframe-container" style="text-align: center; margin: 20px 0;">
            <div style="margin-bottom: 20px;">
                <script async="async" data-cfasync="false" src="//pl27817674.effectivegatecpm.com/aeee703d4f892137e0308b64e60939dc/invoke.js"></script>
                <div id="container-aeee703d4f892137e0308b64e60939dc"></div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <script type="text/javascript">
                    atOptions = {
                        'key' : '080b9af8a83e0f0b44862a9951f6118f',
                        'format' : 'iframe',
                        'height' : 250,
                        'width' : 300,
                        'params' : {}
                    };
                </script>
                <script type="text/javascript" src="//www.highperformanceformat.com/080b9af8a83e0f0b44862a9951f6118f/invoke.js"></script>
            </div>
        </div>
    `;
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
