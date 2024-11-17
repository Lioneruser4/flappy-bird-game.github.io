function downloadContent() {
    const url = document.getElementById('url').value;
    const message = document.getElementById('message');

    if (!url) {
        message.innerText = 'Lütfen bir Instagram URL\'si girin.';
        return;
    }

    // Simüle edilen indirme işlemi
    const simulatedDownloadUrl = `https://www.example.com/download?url=${encodeURIComponent(url)}`;
    message.innerHTML = `<a href="${simulatedDownloadUrl}" target="_blank">İndirme Linki</a>`;
}
