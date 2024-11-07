let interval;
let reportCount = 0;
let spamCount = 0;

document.getElementById('start-button').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const reportCountInput = document.getElementById('report-count').value;
    const responseMessage = document.getElementById('response-message');
    const liveStreamUrl = document.getElementById('live-stream-url').value;
    totalReports = parseInt(reportCountInput, 10);

    if (!username || totalReports <= 0 || !liveStreamUrl) {
        responseMessage.textContent = 'Lütfen geçerli bir kullanıcı adı, rapor sayısı ve canlı yayın linki girin.';
        return;
    }

    reportCount = 0;
    document.getElementById('start-button').disabled = true;
    document.getElementById('stop-button').disabled = false;

    interval = setInterval(() => {
        reportAccount(username, liveStreamUrl);
        reportCount++;
        responseMessage.textContent = `Şu ana kadar gönderilen rapor sayısı: ${reportCount}`;
    }, 100); // 0.1 saniye aralıklarla rapor gönder

    if (reportCount >= totalReports) {
        clearInterval(interval);
        responseMessage.textContent = `${username} kullanıcısı için toplam ${totalReports} rapor gönderildi.`;
        document.getElementById('start-button').disabled = false;
        document.getElementById('stop-button').disabled = true;
    }
});

document.getElementById('stop-button').addEventListener('click', function() {
    clearInterval(interval);
    document.getElementById('response-message').textContent = 'Rapor işlemi durduruldu.';
    document.getElementById('start-button').disabled = false;
    document.getElementById('stop-button').disabled = true;
});

function reportAccount(username, liveStreamUrl) {
    const TIKTOK_REPORT_URL = `https://www.tiktok.com/report/${username}`; // Varsayımsal URL
    fetch(TIKTOK_REPORT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            reason: 'Scam and Fraud, Violence and Graphic Content', 
            liveStreamUrl: liveStreamUrl
        })
    })
    .then(response => {
        if (response.ok) {
            console.log(`${username} kullanıcısı başarıyla şikayet edildi.`);
        } else {
            console.log(`${username} kullanıcısını şikayet etmek başarısız oldu.`);
        }
    })
    .catch(error => {
        console.log(`Bir hata oluştu: ${error.message}`);
    });
}
