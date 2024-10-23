function spin() {
    const reels = ['reel1', 'reel2', 'reel3'];
    const symbols = ['🍒', '🍋', '🍉', '🔔', '⭐'];
    const result = document.getElementById('result');

    // Her bir çarkın animasyonunu başlatıyoruz
    reels.forEach((reel, index) => {
        const reelElement = document.getElementById(reel);
        reelElement.classList.add('spin-animation');
    });

    // 2 saniye sonra animasyonu durdurup rastgele bir sembol seçiyoruz
    setTimeout(() => {
        reels.forEach((reel, index) => {
            const reelElement = document.getElementById(reel);
            reelElement.classList.remove('spin-animation');

            // Rastgele sembol seç ve çarkı bu sembolde durdur
            const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];

            // İlk sembolü (ilk div) güncelliyoruz
            reelElement.children[0].innerText = randomSymbol;
        });

        // Sonuçları kontrol et
        const slot1 = document.getElementById('reel1').children[0].innerText;
        const slot2 = document.getElementById('reel2').children[0].innerText;
        const slot3 = document.getElementById('reel3').children[0].innerText;

        if (slot1 === slot2 && slot2 === slot3) {
            result.innerText = "🎉 You Win! 🎉";
        } else {
            result.innerText = "Try Again!";
        }

    }, 2000); // 2 saniyelik animasyon süresi
}
