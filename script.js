// URL'den chat ID'yi al
const urlParams = new URLSearchParams(window.location.search);
const chatId = urlParams.get("chat_id");

if (!chatId) {
    alert("Chat ID bulunamadı. Lütfen Telegram üzerinden giriş yapın.");
    console.error("Chat ID bulunamadı. Lütfen Telegram üzerinden giriş yapın.");
    console.log("Chat ID kontrolü başarısız.");
} else {
    console.log("Chat ID başarıyla alındı.");
}

const downloadButton = document.getElementById("download-btn");
if (downloadButton) {
    console.log("Download butonu bulundu.");
    downloadButton.addEventListener("click", async () => {
        const youtubeUrl = document.getElementById("youtube-url").value;
        const status = document.getElementById("status");

        if (!youtubeUrl) {
            status.textContent = "Lütfen bir YouTube linki veya müzik adı girin.";
            console.warn("YouTube linki veya müzik adı girilmedi.");
            return;
        }

        status.textContent = "Müzik indiriliyor...";

        try {
            // Backend'e istek gönder
            const response = await fetch("https://ytsaytdayukleyen-c19e69bcb937.herokuapp.com", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ youtubeUrl, chatId }), // Chat ID'yi gönder
            });

            const data = await response.json();

            if (data.success) {
                status.textContent = "Müzik başarıyla indirildi! Telegram botundan dosyayı alabilirsiniz.";
                console.log("Müzik indirme başarılı.");
            } else {
                status.textContent = "Bir hata oluştu: " + data.message;
                console.error("Backend hatası: " + data.message);
            }
        } catch (error) {
            status.textContent = "Bir hata oluştu: " + error.message;
            console.error("Fetch hatası: " + error.message);
        }
    });
} else {
    console.error("Download butonu bulunamadı.");
    console.log("Download butonu bulunamadı.");
}
