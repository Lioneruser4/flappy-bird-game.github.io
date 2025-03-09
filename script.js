document.getElementById("download-btn").addEventListener("click", async () => {
    const youtubeUrl = document.getElementById("youtube-url").value;
    const status = document.getElementById("status");

    if (!youtubeUrl) {
        status.textContent = "Lütfen bir YouTube linki girin.";
        return;
    }

    status.textContent = "Müzik indiriliyor...";

    try {
        // Backend'e istek gönder
        const response = await fetch("https://your-backend-url/download", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ youtubeUrl }),
        });

        const data = await response.json();

        if (data.success) {
            status.textContent = "Müzik indirildi! Telegram botundan dosyayı alabilirsiniz.";
        } else {
            status.textContent = "Bir hata oluştu: " + data.message;
        }
    } catch (error) {
        status.textContent = "Bir hata oluştu: " + error.message;
    }
});
