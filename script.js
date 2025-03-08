// Müzik arama fonksiyonu
async function searchMusic() {
    const query = document.getElementById("searchQuery").value;

    if (query.trim() === "") {
        alert("Lütfen bir müzik adı girin.");
        return;
    }

    // API'ye istek gönder
    const response = await fetch(`/search?query=${query}`);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
        displayResults(data.results);
    } else {
        alert("Sonuç bulunamadı.");
    }
}

// Arama sonuçlarını görüntüle
function displayResults(results) {
    const resultsContainer = document.getElementById("searchResults");
    resultsContainer.innerHTML = ""; // Önceki sonuçları temizle

    results.forEach(result => {
        const resultDiv = document.createElement("div");
        resultDiv.classList.add("result-item");

        resultDiv.innerHTML = `
            <h3>${result.title}</h3>
            <button class="download-btn" onclick="downloadMusic('${result.id}')">İndir</button>
        `;

        resultsContainer.appendChild(resultDiv);
    });
}

// Müzik indirme fonksiyonu
async function downloadMusic(videoId) {
    const response = await fetch(`/download?id=${videoId}`);
    const data = await response.json();

    if (data.message) {
        alert(data.message); // Başarılı indirme mesajı
    } else {
        alert("Bir hata oluştu.");
    }
}
