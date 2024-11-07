let interval;
let reportCount = 0;
let totalReports = 0;

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
        if (reportCount < totalReports) {
            reportAccount(username);
            reportCount++;
        } else {
            clearInterval(interval);
            responseMessage.textContent = `${username} kullanıcısı için ${totalReports} rapor gönderildi.`;
            document.getElementById('start-button').disabled = false;
            document.getElementById('stop-button').disabled = true;
        }
    }, 1000); // 1 saniye aralıklarla rapor gönder
});

document.getElementById('stop-button').addEventListener('click', function() {
    clearInterval(interval);
    document.getElementById('response-message').textContent = 'Rapor işlemi durduruldu.';
    document.getElementById('start-button').disabled = false;
    document.getElementById('stop-button').disabled = true;
});

function reportAccount(username) {
    const TIKTOK_REPORT_URL = `https://www.tiktok.com/report/${username}`; // Varsayımsal URL
    fetch(TIKTOK_REPORT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: 'Scam' })
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
