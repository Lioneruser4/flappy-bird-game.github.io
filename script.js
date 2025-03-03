document.getElementById('downloadForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const url = document.getElementById('url').value;

    try {
        const response = await fetch(`/download?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (data.success) {
            window.location.href = data.downloadLink; // İndirme bağlantısını aç
        } else {
            alert(data.message || 'İndirme işlemi başarısız oldu.');
        }
    } catch (error) {
        alert('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    }
});
