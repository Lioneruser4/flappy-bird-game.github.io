let interval;
let reportCount = 0;
let totalReports = 0;
let spamInterval;
let spamCount = 0;

document.getElementById('start-button').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const reportCountInput = document.getElementById('report-count').value;
    const responseMessage = document.getElementById('response-message');
    totalReports = parseInt(reportCountInput, 10);

    if (!username || totalReports <= 0) {
        responseMessage.textContent = 'Lütfen geçerli bir kullanıcı adı ve rapor sayısı girin.';
        return;
    }

    reportCount = 0;
    document.getElementById('start-button').disabled = true;
    document.getElementById('stop-button').disabled = false;

    interval = setInterval(() => {
        reportAccount(username);
        reportCount++;
        responseMessage.textContent = `Şu ana kadar gönderilen rapor sayısı: ${reportCount}`;
    }, 200); // 0.2 saniye aralıklarla rapor gönder

    setTimeout(() => {
        clearInterval(interval);
        responseMessage.textContent = `${username} kullanıcısı için ${reportCount} rapor gönderildi.`;
        document.getElementById('start-button').disabled = false;
        document.getElementById('stop-button').disabled = true;
    }, totalReports * 200); // Toplam rapor sayısına göre süreyi ayarla
});

document.getElementById('stop-button').addEventListener('click', function() {
    clearInterval(interval);
    document.getElementById('response-message').textContent = 'Rapor işlemi durduruldu.';
    document.getElementById('start-button').disabled = false;
    document.getElementById('stop-button').disabled = true;
});

document.getElementById('spam-button').addEventListener('click', function() {
    const liveStreamUrl = document.getElementById('live-stream-url').value;
    const spamCountDisplay = document.getElementById('spam-count');
    if (liveStreamUrl) {
        spamCount = 0;
        document.getElementById('spam-button').disabled = true;
        document.getElementById('stop-spam-button').disabled = false;

        spamInterval = setInterval(() => {
            spamLiveStream(liveStreamUrl);
            spamCount++;
            spamCountDisplay.textContent = `Gönderilen spam mesaj sayısı: ${spamCount}`;
        }, 500); // 0.5 saniye aralıklarla spam mesaj gönder
        document.getElementById('response-message').textContent = 'Canlı yayına spam mesajlar gönderiliyor.';
    } else {
        document.getElementById('response-message').textContent = 'Lütfen geçerli bir canlı yayın linki girin.';
    }
});

document.getElementById('stop-spam-button').addEventListener('click', function() {
    clearInterval(spamInterval);
    document.getElementById('response-message').textContent = 'Spam işlemi durduruldu.';
    document.getElementById('spam-button').disabled = false;
    document.getElementById('stop-spam-button').disabled = true;
});

function reportAccount(username) {
    const TIKTOK_REPORT_URL = `https://www.tiktok.com/report/${username}`; // Varsayımsal URL
    fetch(TIKTOK_REPORT_URL
