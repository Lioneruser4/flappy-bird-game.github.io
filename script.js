
// Oyun durumu
let cards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let matchedPairs = 0;
const totalPairs = 8;

// Emoji seti
const emojis = ['🐶', '🐱', '🦊', '🐻', '🦁', '🐯', '🦄', '🐮', '🐷', '🐵'];

// Sayfa yüklendiğinde oyunu başlat
document.addEventListener('DOMContentLoaded', function () {
    // Telegram Web App nesnesini alıyoruz
    const tg = window.Telegram.WebApp;

    // Elementleri seçiyoruz
    const userInfoDiv = document.getElementById('user-info');
    const gameAreaDiv = document.getElementById('game-area');
    const errorAreaDiv = document.getElementById('error-area');
    const memoryBoard = document.getElementById('memory-board');
    const restartButton = document.getElementById('restart-button');
    const movesDisplay = document.getElementById('moves');
    const matchedDisplay = document.getElementById('matched');

    // Oyunu başlat
    function initGame() {
        // Oyun tahtasını temizle
        memoryBoard.innerHTML = '';
        moves = 0;
        matchedPairs = 0;
        movesDisplay.textContent = moves;
        matchedDisplay.textContent = `${matchedPairs}/${totalPairs}`;
        cards = [];
        lockBoard = false;
        hasFlippedCard = false;
        
        // Kart çiftlerini oluştur
        const gameEmojis = [...emojis].slice(0, totalPairs);
        const gameCards = [...gameEmojis, ...gameEmojis];
        
        // Kartları karıştır
        gameCards.sort(() => Math.random() - 0.5);
        
        // Kartları oluştur
        gameCards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.emoji = emoji;
            card.dataset.index = index;
            card.innerHTML = `<span>${emoji}</span>`;
            card.addEventListener('click', flipCard);
            memoryBoard.appendChild(card);
            cards.push(card);
        });
    }

    // Kart çevirme işlemi
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

    // Eşleşme kontrolü
    function checkForMatch() {
        const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
        
        if (isMatch) {
            disableCards();
            matchedPairs++;
            matchedDisplay.textContent = `${matchedPairs}/${totalPairs}`;
            
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
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        resetBoard();
    }

    // Eşleşme yoksa kartları geri çevir
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
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    // Yeniden başlat butonu
    restartButton.addEventListener('click', initGame);

    // Telegram'dan gelen kullanıcı verisini kontrol et
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const user = tg.initDataUnsafe.user;

        // Hoşgeldin mesajını oluştur
        const welcomeMessage = `
            <h1>Hoş Geldin, ${user.first_name}!</h1>
            <p>Hafıza Oyunu'na hoş geldin!</p>
        `;
        userInfoDiv.innerHTML = welcomeMessage;

        // Oyun alanını göster ve oyunu başlat
        gameAreaDiv.classList.remove('hidden');
        initGame();

    } else {
        // Eğer Telegram dışından girildiyse hata mesajı göster
        userInfoDiv.classList.add('hidden');
        errorAreaDiv.classList.remove('hidden');
        console.error("Telegram user data not found. Make sure you are running this in a Telegram Web App.");
    }

    // Web App'in hazır olduğunu Telegram'a bildir
    tg.ready();
});
