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

// VAQLT VƏ XAL DƏYİŞƏNLƏRİ
let timerInterval;
let timeElapsed = 0; 
const SCORE_MATCH = 100;
const SCORE_MISMATCH = -20;

// EMOJİ HOVUZU (70 fərqli emoji)
const ALL_EMOJIS = [
    '🐶', '🐱', '🦊', '🐻', '🦁', '🐯', '🦄', '🐮', '🐷', '🐵', 
    '🦉', '🐸', '🍎', '🍊', '🍋', '🍇', '🍉', '🍓', '🍒', '🍑', 
    '🥝', '🍍', '🥥', '🥑', '🚗', '🚕', '🚌', '🚓', '🚑', '🚒', 
    '🚚', '🚢', '🚀', '🚁', '🚂', '⌚', '📱', '💻', '🖥️', 
    '🔑', '🔒', '🔓', '🎲', '🧩', '🎈', '🎁', '🎂', '👑', '💍',
    '🌞', '🌛', '⭐', '🌈', '🔥', '💧', '🌿', '🍄', '🔔', '📚',
    '🔬', '🔭', '💰', '💳', '📧', '💡', '📌', '📎', '💉', '💊' 
];

// DOM ELEMENTLƏRİ VƏ SƏSLƏR
let memoryBoard, movesDisplay, matchedDisplay, timerDisplay, scoreDisplay, adContainer, finalMovesDisplay, finalScoreDisplay, currentLevelDisplay, themeIcon, gameArea;
let flipSound, matchSound, mismatchSound, winSound, gameoverSound;
let onlineUsersDisplay; 

// PUBNUB DƏYİŞƏNLƏRİ (Online İstifadəçi Sayı üçün)
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
    
    // Səs elementlərini seç
    flipSound = document.getElementById('flip-sound');
    matchSound = document.getElementById('match-sound');
    mismatchSound = document.getElementById('mismatch-sound');
    winSound = document.getElementById('win-sound');
    gameoverSound = document.getElementById('gameover-sound');

    // Düymə hadisələri
    document.getElementById('restart-button').addEventListener('click', function() {
        level = 1; // Tam sıfırlama
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

function initPubNub() {
    // PubNub AÇARLARI BURAYA DAXİL EDİN
    pubnub = new PubNub({
        publishKey: 'YOUR_PUB_KEY', // <-- ZƏHMƏT OLMASA BUNU DƏYİŞDİRİN
        subscribeKey: 'YOUR_SUB_KEY', // <-- ZƏHMƏT OLMASA BUNU DƏYİŞDİRİN
        userId: 'user-' + Math.random().toString(36).substring(2, 9) 
    });

    pubnub.addListener({
        presence: function(presenceEvent) {
            if (presenceEvent.channel === PUBNUB_CHANNEL && onlineUsersDisplay) {
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
        if (response && response.channels && response.channels[PUBNUB_CHANNEL] && onlineUsersDisplay) {
            onlineUsersDisplay.textContent = response.channels[PUBNUB_CHANNEL].occupancy;
        }
    });
}

// ⭐ SƏS GECİKMƏSİNİN HƏLLİ (Audio Klonlama) ⭐
function playSound(audioElement) {
    if (!audioElement) return;
    const clone = audioElement.cloneNode(); 
    clone.volume = 0.5;
    clone.play().catch(e => console.error("Səs oynatıla bilmədi:", e)); // Xəta tutucusu
}

function startGame() {
    initGame();
}

function initGame() {
    clearInterval(timerInterval);

    // Səviyyəyə görə cütlük sayını təyin et
    if (level === 1) totalPairs = 6;
    else if (level === 2) totalPairs = 8;
    else if (level >= MAX_LEVEL) totalPairs = 10;
    
    // Sıfırlamalar
    memoryBoard.innerHTML = '';
    cards = []; 
    moves = 0;
    matchedPairs = 0;
    if (level === 1) score = 0; // İlk səviyyədə xal sıfırlanır
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

    // ⭐ GÖRÜNMƏ MƏNTİQİ: OYUN GÖRÜNÜR, REKLAM GİZLƏNİR ⭐
    gameArea.style.display = 'block'; 
    adContainer.style.display = 'none'; 
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
    // Kart lövhəsi klasslarını təyin et
    memoryBoard.className = 'memory-board';
    if (totalPairs === 6) memoryBoard.classList.add('grid-4x3');
    else if (totalPairs === 8) memoryBoard.classList.add('grid-4x4');
    else if (totalPairs === 10) memoryBoard.classList.add('grid-4x5');
    
    // Kartları yarat və qarışdır
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
        score += SCORE_MATCH;
        scoreDisplay.textContent = score;

        playSound(matchSound);
        disableCards();
        matchedPairs++;
        matchedDisplay.textContent = `${matchedPairs}/${totalPairs}`;
        
        if (matchedPairs === totalPairs) {
            clearInterval(timerInterval);
            // Partlayış animasiyasının bitməsini gözləyirik
            setTimeout(() => {
                handleGameOver(true);
            }, 600); 
        }
    } else {
        score += SCORE_MISMATCH;
        if (score < 0) score = 0; 
        scoreDisplay.textContent = score;

        playSound(mismatchSound);
        // Səhv kartlar üçün titrəmə animasiyası
        firstCard.classList.add('shake');
        secondCard.classList.add('shake');
        
        setTimeout(() => {
            firstCard.classList.remove('shake');
            secondCard.classList.remove('shake');
            unflipCards();
        }, 350); 
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
    lockBoard = true;
    
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
}

// OYUN BİTDİ SAHƏSİ (Reklamın daxil edilməsi)
function handleGameOver(isSuccess) {
    lockBoard = true;
    playSound(winSound);

    // GÖRÜNMƏ MƏNTİQİ: OYUN GİZLƏNİR, REKLAM GÖRÜNÜR
    gameArea.style.display = 'none'; 
    adContainer.style.display = 'block'; 

    finalMovesDisplay.textContent = moves;
    finalScoreDisplay.textContent = score;
    
    const adTitle = document.getElementById('ad-title');
    const finalMessage = document.querySelector('.final-message');
    const nextLevelBtn = document.getElementById('next-level');
    const restartLevelBtn = document.getElementById('restart-level');
    const adContent = document.getElementById('ad-content'); 

    // Məlumatların yenilənməsi
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
    
    // Düymə Hadisələri
    nextLevelBtn.onclick = function() { 
        if (level < MAX_LEVEL) {
            level++;
        }
        initGame(); 
    };

    restartLevelBtn.onclick = function() {
        initGame(); 
    };

    // ------------------------------------------------------------------
    // ⭐ KRİTİK REKLAM HƏLLİ: SCRIPT ELEMENTLƏRİNİN DÜZGÜN YÜKLƏNMƏSİ ⭐
    adContent.innerHTML = ''; 

    const adContainerDiv = document.createElement('div');
    adContainerDiv.className = 'ad-iframe-container';
    adContainerDiv.style.cssText = 'text-align: center; margin: 20px 0;';

    // 1. Birinci Banner
    const script1 = document.createElement('script');
    script1.type = 'text/javascript';
    script1.src = '//pl27817770.effectivegatecpm.com/5d/b8/3f/5db83f02b180dc8f2699fba7459b6382.js';
    
    const div1 = document.createElement('div');
    div1.style.marginBottom = '20px';
    div1.appendChild(script1);
    adContainerDiv.appendChild(div1);

    // 2. İkinci Banner
    const script2 = document.createElement('script');
    script2.type = 'text/javascript';
    script2.src = '//pl27817788.effectivegatecpm.com/91/a1/d1/91a1d1bda43a3aa15888917200b9e931.js';
    
    const div2 = document.createElement('div');
    div2.style.marginBottom = '20px';
    div2.appendChild(script2);
    adContainerDiv.appendChild(div2);

    adContent.appendChild(adContainerDiv);
    // ------------------------------------------------------------------
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
