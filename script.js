
// Oyun dəyişənləri
let cards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let matchedPairs = 0;
const totalPairs = 8;

// Emoji dəsti
const emojis = ['🐶', '🐱', '🦊', '🐻', '🦁', '🐯', '🦄', '🐮', '🐷', '🐵'];

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
        matchedDisplay.textContent = `${matchedPairs}/${totalPairs}`;
        cards = [];
        lockBoard = false;
        hasFlippedCard = false;
        
        // Kart cütlərini yarat
        const gameEmojis = [...emojis].slice(0, totalPairs);
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
                    alert(`Təbriklər! Oyunu ${moves} hərəkətdə tamamladınız!`);
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
    }

    // Yenidən başlat düyməsi
    restartButton.addEventListener('click', initGame);

    // Telegram-dan gələn istifadəçi məlumatını yoxla
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const user = tg.initDataUnsafe.user;

        // Xoş gəlmisiniz mesajı yarat
        const welcomeMessage = `
            <h1>Xoş gəlmisiniz, ${user.first_name}!</h1>
            <p>Yaddaş Oyununa xoş gəlmisiniz!</p>
        `;
        userInfoDiv.innerHTML = welcomeMessage;

        // Oyun sahəsini göstər və oyunu başlat
        gameAreaDiv.classList.remove('hidden');
        initGame();

    } else {
        // Əgər Telegram xaricindən daxil olunubsa, xəta mesajı göstər
        userInfoDiv.classList.add('hidden');
        errorAreaDiv.classList.remove('hidden');
        console.error("Telegram istifadəçi məlumatı tapılmadı. Zəhmət olmasa bu tətbiqə Telegram daxilindən daxil olun.");
    }

    // Web App-in hazır olduğunu Telegram-a bildir
    tg.ready();
});
