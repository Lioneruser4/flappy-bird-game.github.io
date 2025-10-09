// OYUN DƏYİŞƏNLƏRİ
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

// VAQT VƏ XAL DƏYİŞƏNLƏRİ
let timerInterval;
let timeElapsed = 0; 
const SCORE_MATCH = 100;
const SCORE_MISMATCH = -20;

// EMOJİ HOVUZU 
const ALL_EMOJIS = [
    '🐶', '🐱', '🦊', '🐻', '🦁', '🐯', '🦄', '🐮', '🐷', '🐵', '🦉', '🐸', '🍎', '🍊', '🍋', '🍇', '🍉', '🍓', '🍒', '🍑', 
    '🥝', '🍍', '🥥', '🥑', '🚗', '🚕', '🚌', '🚓', '🚑', '🚒', '🚚', '🚢', '🚀', '🚁', '🚂', '⌚', '📱', '💻', '🖥️', 
    '🔑', '🔒', '🔓', '🎲', '🧩', '🎈', '🎁', '🎂', '👑', '💍','🌞', '🌛', '⭐', '🌈', '🔥', '💧', '🌿', '🍄', '🔔', '📚',
    '🔬', '🔭', '💰', '💳', '📧', '💡', '📌', '📎', '💉', '💊' 
];

// DOM ELEMENTLƏRİ VƏ SƏSLƏR
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
    
    // ⭐ KRİTİK SƏS DÜZƏLİŞİ: Səs elementlərinin yükləndiyini yoxla
    flipSound = document.getElementById('flip-sound');
    matchSound = document.getElementById('match-sound');
    mismatchSound = document.getElementById('mismatch-sound');
    winSound = document.getElementById('win-sound');
    gameoverSound = document.getElementById('gameover-sound');

    // Düymə hadisələri
    document.getElementById('restart-button').addEventListener('click', function() {
        level = 1; 
        initGame();
    });
    document.getElementById('theme-toggle-button').addEventListener('click', toggleDarkMode);

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.textContent = '☀️';
    }
    
    initPubNub(); 
    startGame();
});

// PubNub və Səs funksiyaları eyni qalır

function initPubNub() {
    // PubNub AÇARLARI BURAYA DAXİL EDİN
    pubnub = new PubNub({
        publishKey: 'YOUR_PUB_KEY', 
        subscribeKey: 'YOUR_SUB_KEY', 
        userId: 'user-' + Math.random().toString(36).substring(2, 9) 
    });
    // ... (PubNub məntiqi) ...
    pubnub.subscribe({ channels: [PUBNUB_CHANNEL], withPresence: true });
    pubnub.hereNow({ channels: [PUBNUB_CHANNEL] }, function(status, response) {
        if (response && response.channels && response.channels[PUBNUB_CHANNEL] && onlineUsersDisplay) {
            onlineUsersDisplay.textContent = response.channels[PUBNUB_CHANNEL].occupancy;
        }
    });
}

// SƏS GECİKMƏSİNİN HƏLLİ
function playSound(audioElement) {
    if (!audioElement) return;
    const clone = audioElement.cloneNode(); 
    clone.volume = 0.5;
    clone.play().catch(e => console.error("Səs oynatıla bilmədi:", e));
}

function startGame() { initGame(); }

function initGame() {
    clearInterval(timerInterval);
    if (level === 1) totalPairs = 6;
    else if (level === 2) totalPairs = 8;
    else if (level >= MAX_LEVEL) totalPairs = 10;
    
    memoryBoard.innerHTML = ''; cards = []; moves = 0; matchedPairs = 0;
    if (level === 1) score = 0; 
    timeElapsed = 0; lockBoard = false; hasFlippedCard = false; firstCard = null; secondCard = null;

    movesDisplay.textContent = moves; scoreDisplay.textContent = score;
    document.getElementById('total-pairs').textContent = totalPairs;
    matchedDisplay.textContent = matchedPairs;
    currentLevelDisplay.textContent = `(Səviyyə ${level})`;
    timerDisplay.textContent = formatTime(timeElapsed);
    
    createCards();
    startTimer();

    gameArea.style.display = 'block'; adContainer.style.display = 'none'; 
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeElapsed++;
        timerDisplay.textContent = formatTime(timeElapsed);
    }, 1000);
}

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}

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
        score += SCORE_MATCH; scoreDisplay.textContent = score;
        playSound(matchSound); disableCards();
        matchedPairs++; matchedDisplay.textContent = `${matchedPairs}/${totalPairs}`;
        
        if (matchedPairs === totalPairs) {
            clearInterval(timerInterval);
            setTimeout(() => { handleGameOver(true); }, 600); 
        }
    } else {
        score += SCORE_MISMATCH; if (score < 0) score = 0; scoreDisplay.textContent = score;
        playSound(mismatchSound);
        firstCard.classList.add('shake');
        secondCard.classList.add('shake');
        
        // Kartları çevirmədən əvvəl kilidi aktivləşdiririk
        lockBoard = true; 
        setTimeout(() => {
            firstCard.classList.remove('shake');
            secondCard.classList.remove('shake');
            unflipCards();
        }, 1000); // 1 saniyə gözləmə
    }
}

function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetBoard();
}

function resetBoard() {
    hasFlippedCard = false;
    lockBoard = false; // ⭐ KRİTİK DÜZƏLİŞ: Məhz burda kilidi açırıq
    firstCard = null;
    secondCard = null;
}

// OYUN BİTDİ SAHƏSİ (Reklamın dərhal yüklənməsi)
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
    
    nextLevelBtn.onclick = function() { if (level < MAX_LEVEL) { level++; } initGame(); };
    restartLevelBtn.onclick = function() { initGame(); };

    // REKLAM HƏLLİ
    adContent.innerHTML = ''; 
    const adContainerDiv = document.createElement('div');
    adContainerDiv.className = 'ad-iframe-container';
    adContainerDiv.style.cssText = 'text-align: center; margin: 20px 0;';

    const loadAdScript = (src) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        const div = document.createElement('div');
        div.style.marginBottom = '20px';
        div.appendChild(script);
        adContainerDiv.appendChild(div);
    };

    loadAdScript('//pl27817770.effectivegatecpm.com/5d/b8/3f/5db83f02b180dc8f2699fba7459b6382.js');
    loadAdScript('//pl27817788.effectivegatecpm.com/91/a1/d1/91a1d1bda43a3aa15888917200b9e931.js');
    adContent.appendChild(adContainerDiv);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

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
