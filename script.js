
// Sayfa tamamen yüklendiğinde bu fonksiyon çalışacak
document.addEventListener('DOMContentLoaded', function () {
    // Telegram Web App nesnesini alıyoruz
    const tg = window.Telegram.WebApp;

    // Elementleri seçiyoruz
    const userInfoDiv = document.getElementById('user-info');
    const gameAreaDiv = document.getElementById('game-area');
    const errorAreaDiv = document.getElementById('error-area');
    const clickButton = document.getElementById('click-button');
    const scoreSpan = document.getElementById('score');

    let score = 0;

    // Telegram'dan gelen kullanıcı verisini kontrol et
    // initDataUnsafe, veriyi doğrulamadan hızlıca almak için kullanılır.
    // Sadece görüntüleme amaçlı olduğu için güvenlidir.
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const user = tg.initDataUnsafe.user;

        // Hoşgeldin mesajını oluştur
        const welcomeMessage = `
            <h1>Hoş Geldin, ${user.first_name}!</h1>
            <p>Telegram ID: ${user.id}</p>
        `;
        userInfoDiv.innerHTML = welcomeMessage;

        // Oyun alanını göster
        gameAreaDiv.classList.remove('hidden');

    } else {
        // Eğer Telegram dışından girildiyse hata mesajı göster
        userInfoDiv.classList.add('hidden');
        errorAreaDiv.classList.remove('hidden');
        console.error("Telegram user data not found. Make sure you are running this in a Telegram Web App.");
    }

    // Tıklama oyunu mantığı
    clickButton.addEventListener('click', () => {
        score++;
        scoreSpan.textContent = score;
    });

    // Web App'in hazır olduğunu Telegram'a bildir
    tg.ready();
});
