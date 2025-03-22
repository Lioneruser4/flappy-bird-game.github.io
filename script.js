document.getElementById('downloadForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const url = document.getElementById('url').value;
    const resultDiv = document.getElementById('result');

    resultDiv.textContent = 'Müzik indiriliyor...';

    // Telegram Web App'den chat_id'yi al
    const tg = window.Telegram.WebApp;
    const chatId = tg.initDataUnsafe.user.id;

    // Backend API'ye istek gönder (Heroku URL'sini kullanın)
    fetch('https://songbot-iota.vercel.app/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url, chat_id: chatId }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            resultDiv.textContent = 'Müzik başarıyla indirildi! Telegram botu üzerinden gönderiliyor...';
        } else {
            resultDiv.textContent = 'Müzik indirilemedi. Lütfen linki kontrol edin.';
        }
    })
    .catch(error => {
        resultDiv.textContent = 'Bir hata oluştu. Lütfen tekrar deneyin.';
        console.error(error);
    });
});
