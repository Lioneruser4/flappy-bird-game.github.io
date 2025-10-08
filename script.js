// Oyun dəyişənləri
let cards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let matchedPairs = 0;
let totalPairs = 6; // Başlanğıc cüt sayı
let currentLevel = 1;
let usedEmojis = [];

// Geniş emoji dəsti
const allEmojis = [
    '🐶', '🐱', '🦊', '🐻', '🦁', '🐯', '🦄', '🐮', '🐷', '🐵', '🦉', '🐸',
    '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄',
    '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦗', '🕷', '🦂', '🐢', '🐍', '🦎',
    '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈',
    '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘',
    '🦬', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕',
    '🐩', '🐈', '🐓', '🦚', '🦜', '🦢', '🦩', '🕊', '🐇', '🦝', '🦨', '🦡',
    '🦔', '🐁', '🐀', '🐿', '🦥', '🦦', '🦫', '🦨', '🦘', '🦡', '🐾', '🦃',
    '🦤', '🦚', '🦜', '🦢', '🦩', '🦚', '🦜', '🐦', '🐧', '🐓', '🦃', '🦤',
    '🦅', '🦉', '🦚', '🦜', '🦢', '🦩', '🦚', '🦜', '🐦', '🐧', '🐓', '🦃',
    '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑',
    '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶', '🫑',
    '🌽', '🥕', '🫛', '🥐', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞',
    '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🫓', '🥪',
    '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🥫', '🍝', '🍜', '🍲',
    '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮',
    '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬',
    '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '🫖', '☕', '🍵',
    '🧃', '🥤', '🧋', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧉',
    '🍾', '🧊', '🥄', '🍴', '🍽', '🥣', '🥡', '🥢', '🧂', '⚽', '🏀', '🏈',
    '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑',
    '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽',
    '🛹', '🛼', '🛷', '⛸', '🥌', '🎯', '🎮', '🎲', '🎰', '🎳', '🎪', '🛝',
    '🎡', '🎢', '🎠', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '✈️',
    '🚁', '🚤', '⛵', '⛴', '🚢', '🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓',
    '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🛵', '🏍', '🛺', '🚲', '🛴',
    '🚡', '🚠', '🚟', '🚝', '🚄', '🚅', '🚈', '🚂', '🚃', '🚋', '🚌', '🚍',
    '🚎', '🚐', '🚑', '🚒', '🚓', '🚕', '🚗', '🚙', '🚚', '🚛', '🚜', '🏎',
    '🏍', '🛵', '🚲', '🛴', '🛹', '🚏', '🛣', '🛤', '⛽', '🚨', '🚥', '🚦',
    '🚧', '⚓', '⛵', '🛶', '🚤', '🛳', '⛴', '🛥', '🚢', '✈️', '🛩', '🚁',
    '🚟', '🚠', '🚡', '🛰', '🚀', '🛸', '🛎', '🧳', '⌛', '⏳', '⌚', '⏰',
    '🌍', '🌎', '🌏', '🌐', '🗺', '🗾', '🧭', '🏔', '⛰', '🌋', '🗻', '🏕',
    '🏖', '🏜', '🏝', '🏞', '🏟', '🏛', '🏗', '🏘', '🏚', '🏠', '🏡', '🏢',
    '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏯', '🏰',
    '💒', '🗼', '🗽', '⛪', '🕌', '🛕', '🕍', '⛩', '🕋', '⛲', '⛺', '🌁',
    '🌃', '🏙', '🌄', '🌅', '🌆', '🌇', '🌉', '🎠', '🎡', '🎢', '💈', '🎪'
];

// Təsadüfi emojiləri seç
function getRandomEmojis(count) {
    const shuffled = [...allEmojis].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, allEmojis.length));
}

let currentEmojis = [];

// DOM elementləri
let memoryBoard, movesDisplay, matchedDisplay, restartButton, gameAreaDiv, userInfoDiv, profileBg, errorAreaDiv;

// Sayfa yüklendiğinde oyunu başlat
document.addEventListener('DOMContentLoaded', function() {
    // Elementleri seç
    userInfoDiv = document.getElementById('user-info');
    gameAreaDiv = document.getElementById('game-area');
    errorAreaDiv = document.getElementById('error-area');
    memoryBoard = document.getElementById('memory-board');
    restartButton = document.getElementById('restart-button');
    movesDisplay = document.getElementById('moves');
    matchedDisplay = document.getElementById('matched');
    const totalPairsDisplay = document.getElementById('total-pairs');
    profileBg = document.getElementById('profile-bg');
    
    // Toplam eşleşme sayısını göster
    if (totalPairsDisplay) totalPairsDisplay.textContent = totalPairs;
    
    // Telegram WebApp kontrolü
    const tg = window.Telegram && window.Telegram.WebApp;
    
    // Oyunu başlat
    initGame();
    
    // Telegram kullanıcı bilgilerini yükle
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const user = tg.initDataUnsafe.user;
        if (userInfoDiv) {
            userInfoDiv.innerHTML = `Xoş gəlmisiniz, ${user.first_name || 'İstifadəçi'}!`;
            userInfoDiv.classList.remove('hidden');
            
            // Profil fotoğrafını ayarla
            if (user.photo_url && profileBg) {
                profileBg.style.backgroundImage = `url('${user.photo_url}')`;
                profileBg.classList.add('loaded');
            }
            
            // Telegram butonlarını göster
            if (tg.MainButton) {
                tg.MainButton.setText('OYUNA BAŞLA').show();
                tg.MainButton.onClick(function() {
                    tg.MainButton.hide();
                    startGame();
                });
            }
        }
    } else {
        // Telegram dışındaki tarayıcılar için
        if (errorAreaDiv) errorAreaDiv.classList.add('hidden');
        startGame();
    }
    
    // Oyunu başlat
    function startGame() {
        if (gameAreaDiv) gameAreaDiv.classList.remove('hidden');
        initGame();
    }
    
    // Oyunu başlat
    function initGame() {
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
        
        // Kartları oluştur
        createCards();
    }
    
    // Kartları oluştur
    function createCards() {
        if (!memoryBoard) return;
        
        // 12 farklı emojiden 6'sını seç (toplam 12 kart için)
        const selectedEmojis = emojis.slice(0, totalPairs);
        const gameCards = [];
        
        // Her emojiden 2'şer tane ekle
        selectedEmojis.forEach(function(emoji) {
            gameCards.push(emoji, emoji);
        });
        
        // Kartları karıştır
        shuffleArray(gameCards);
        
        // Kartları oluştur ve tahtaya ekle
        gameCards.forEach(function(emoji, index) {
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
    
    // Kart çevirme işlemi
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        if (this.classList.contains('flipped')) return;
        
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
    
    // Eşleşme kontrolü
    function checkForMatch() {
        var isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
        
        if (isMatch) {
            disableCards();
            matchedPairs++;
            if (matchedDisplay) matchedDisplay.textContent = matchedPairs;
            
            // Tüm eşleşmeler tamamlandı mı?
            if (matchedPairs === totalPairs) {
                setTimeout(function() {
                    if (confirm('Təbriklər! Səviyyə ' + currentLevel + ' tamamlandı!\n\nGediş sayı: ' + moves + '\n\nNövbəti səviyyəyə keçmək istəyirsinizmi?')) {
                        currentLevel++;
                        initGame();
                    } else {
                        currentLevel = 1;
                        initGame();
                    }
                }, 500);
            }
        } else {
            unflipCards();
        }
    }
    
    // Eşleşen kartları devre dışı bırak
    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        
        resetBoard();
    }
    
    // Eşleşmeyen kartları geri çevir
    function unflipCards() {
        lockBoard = true;
        
        setTimeout(function() {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            
            resetBoard();
        }, 1000);
    }
    
    // Oyun tahtasını sıfırla
    function resetBoard() {
        hasFlippedCard = false;
        lockBoard = false;
        firstCard = null;
        secondCard = null;
    }
    
    // Dizi karıştırma fonksiyonu
    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
    
    // Yeniden başlat butonu
    if (restartButton) {
        restartButton.addEventListener('click', initGame);
    }
});
    } else {
        // Telegram dışındaki tarayıcılar için
        if (errorAreaDiv) errorAreaDiv.classList.add('hidden');
        startGame();
    }
    
    // Oyunu başlat
    function startGame() {
        if (gameAreaDiv) gameAreaDiv.classList.remove('hidden');
        initGame();
    }
    
    // Oyunu başlat
    function initGame() {
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
        
        // Kartları oluştur
        createCards();
    }
    
    // Kartları oluştur
    function createCards() {
        if (!memoryBoard) return;
        
        const gameCards = [];
        
        // Her emojiden 2'şer tane ekle
        currentEmojis.forEach(emoji => {
            gameCards.push(emoji, emoji);
        });
        
        // Kartları karıştır
        shuffleArray(gameCards);
        
        // Izgara boyutunu ayarla
        const gridSize = Math.ceil(Math.sqrt(gameCards.length));
        memoryBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        
        // Kartları oluştur ve tahtaya ekle
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
    
    // Kart çevirme işlemi
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        if (this.classList.contains('flipped')) return;
        
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
    
    // Eşleşme kontrolü
    function checkForMatch() {
        const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
        
        if (isMatch) {
            disableCards();
            matchedPairs++;
            if (matchedDisplay) matchedDisplay.textContent = matchedPairs;
            
            // Tüm eşleşmeler tamamlandı mı?
            if (matchedPairs === totalPairs) {
                setTimeout(() => {
                    alert(`Tebrikler! Oyunu ${moves} hamlede tamamladınız!`);
                }, 500);
            }
        } else {
            unflipCards();
        }
    }
    
    // Eşleşen kartları devre dışı bırak
    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        
        resetBoard();
    }
    
    // Eşleşmeyen kartları geri çevir
    function unflipCards() {
        lockBoard = true;
        
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            
            resetBoard();
        }, 1000);
    }
    
    // Oyun tahtasını sıfırla
    function resetBoard() {
        hasFlippedCard = false;
        lockBoard = false;
        firstCard = null;
        secondCard = null;
    }
    
    // Dizi karıştırma fonksiyonu
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Yeniden başlat butonu
    if (restartButton) {
        restartButton.addEventListener('click', initGame);
    }
        
        // Reklam iframe-i yarat
        adContent.innerHTML = `
            <div class="ad-iframe-container">
                <iframe src="https://www.effectivegatecpm.com/jmxtn13f4u?key=f0d62284f1985ef0201e08b24c1191f6" 
                        style="width:100%; height:250px; border:none; border-radius:10px;">
                </iframe>
            </div>
            <div class="button-group">
                <button id="next-level" class="game-button">Növbəti Səviyyə</button>
                <button id="restart-level" class="game-button">Yenidən Başla</button>
            </div>
        `;
        
        adContainer.classList.remove('hidden');
        
        // Növbəti səviyyə düyməsi
        const nextLevelBtn = document.getElementById('next-level');
        if (nextLevelBtn) {
            nextLevelBtn.addEventListener('click', function() {
                level++;
                adContainer.classList.add('hidden');
                // Emoji dəstini dəyişdir
                initGame();
            });
        }
        
        // Yenidən başlat düyməsi
        const restartLevelBtn = document.getElementById('restart-level');
        if (restartLevelBtn) {
            restartLevelBtn.addEventListener('click', function() {
                adContainer.classList.add('hidden');
                initGame();
            });
        }
    }

    // Uyğunluq yoxlaması
    function checkForMatch() {
        const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
        
        if (isMatch) {
            disableCards();
            matchedPairs++;
            matchedDisplay.textContent = `${matchedPairs}/${totalPairs}`;
            
            // Bütün cütlüklər tapıldı mı?
            if (matchedPairs === totalPairs) {
                setTimeout(() => {
                    showAd(); // Reklamı göstər
                }, 500);
            }
        } else {
            unflipCards();
        }
    }

    // Uyğun gələn kartları qeyd et
    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        resetBoard();
    }

    // Uyğunluq yoxdursa kartları geri çevir
    function unflipCards() {
        lockBoard = true;
        
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1000);
    }

    // Oyun taxtasını sıfırla
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];

    // Yenidən başlat düyməsi
    restartButton.addEventListener('click', initGame);

    // Telegram-dan gələn istifadəçi məlumatını yoxla
    const isTelegram = window.Telegram && window.Telegram.WebApp;
    let tg = null;
    let user = null;

    // Initialize Telegram WebApp if available
    if (isTelegram) {
        tg = window.Telegram.WebApp;
        user = tg.initDataUnsafe?.user;
        
        // Expand the app to full view
        tg.expand();
        
        // Show user info if available
        if (user) {
            const userInfo = document.getElementById('user-info');
            userInfo.innerHTML = `
                <p>Xoş gəlmisiniz, ${user.first_name || 'İstifadəçi'}!</p>
                <button id="start-game" class="game-button">Oyuna Başla</button>
            `;
            userInfo.classList.remove('hidden');
            
            document.getElementById('start-game').addEventListener('click', function() {
                userInfo.classList.add('hidden');
                document.getElementById('game-area').classList.remove('hidden');
                initGame();
            });
        } else {
            // If no user data in Telegram, show error
            document.getElementById('telegram-login').classList.remove('hidden');
        }
    } else {
        // For non-Telegram users, show the game directly
        document.getElementById('game-area').classList.remove('hidden');
        initGame();
        
        // Hide the Telegram login prompt if shown
        const telegramLogin = document.getElementById('telegram-login');
        if (telegramLogin) {
            telegramLogin.classList.add('hidden');
        }
    }

    // Web App-in hazır olduğunu Telegram-a bildir
    if (tg) {
        tg.ready();
    }
