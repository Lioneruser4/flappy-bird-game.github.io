
// Oyun dəyişənləri
let cards = [];
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let matchedPairs = 0;
let level = 1;
let totalPairs = 8; // İlk səviyyə üçün 8

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the app based on the environment
// Cari səviyyə üçün emojiləri al
function getEmojisForLevel(level) {
    // Hər səviyyədə daha çox emoji istifadə et
    const startIndex = (level - 1) * 4;
    const endIndex = 6 + (level - 1) * 2; // Hər səviyyədə 2 yeni emoji əlavə et
    return [...emojiSets[level - 1]].slice(0, endIndex);
}

// Səhifə yüklənəndə oyunu başlat
document.addEventListener('DOMContentLoaded', function () {
    // Telegram Web App obyektini alırıq
    const tg = window.Telegram.WebApp;

    // Elementləri seçirik
    const userInfoDiv = document.getElementById('user-info');
    const gameAreaDiv = document.getElementById('game-area');
    const errorAreaDiv = document.getElementById('error-area');
    const memoryBoard = document.getElementById('memory-board');
    const restartButton = document.getElementById('restart-button');
    const movesDisplay = document.getElementById('moves');
    const matchedDisplay = document.getElementById('matched');

    // Oyunu başlat
    function initGame() {
        // Oyun taxtasını təmizlə
        memoryBoard.innerHTML = '';
        moves = 0;
        matchedPairs = 0;
        movesDisplay.textContent = moves;
        
        // Səviyyəyə görə cütlərin sayını təyin et
        totalPairs = 8 + (level - 1) * 2; // 2-ci səviyyədə 10 cüt, 3-cü səviyyədə 12 cüt
        if (level > 3) totalPairs = 12; // 3-cü səviyyədən sonra sabit 12 cüt
        
        matchedDisplay.textContent = `${matchedPairs}/${totalPairs}`;
        document.getElementById('level-display').textContent = `Səviyyə: ${level}`;
        
        cards = [];
        lockBoard = false;
        hasFlippedCard = false;
        
        // Cari səviyyə üçün emojiləri al
        const currentEmojis = getEmojisForLevel(level);
        const gameEmojis = currentEmojis.slice(0, totalPairs);
        const gameCards = [...gameEmojis, ...gameEmojis];
        
        // Kartları qarışdır
        gameCards.sort(() => Math.random() - 0.5);
        
        // Kartları yarat
        gameCards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.emoji = emoji;
            card.dataset.index = index;
            
            // Kartın ön və arxa üzlərini yarat
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
        if (this.classList.contains('matched')) return;

        this.classList.add('flipped');

        if (!hasFlippedCard) {
            // İlk kartı çevir
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        // İkinci kartı çevir
        secondCard = this;
        moves++;
        movesDisplay.textContent = moves;
        checkForMatch();
    }

    // Reklam göstər
    function showAd() {
        const adContainer = document.getElementById('ad-container');
        const adContent = document.getElementById('ad-content');
        
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
