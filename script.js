function downloadVideo() {
    const url = document.getElementById('url').value;
    const message = document.getElementById('message');

    if (!url) {
        message.innerText = 'Lütfen bir YouTube URL\'si girin.';
        return;
    }

    // youtube-dl servisini kullanarak indirme bağlantısı oluşturma (örnek amaçlı)
    const downloadUrl = `https://example.com/download?url=${encodeURIComponent(url)}`;

    message.innerHTML = `<a href="${downloadUrl}" target="_blank">İndirme Linki</a>`;
}
