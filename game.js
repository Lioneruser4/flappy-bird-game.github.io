function spin() {
    const symbols = ['🍒', '🍋', '🍊', '🍉', '⭐', '🔔'];
    const slot1 = document.getElementById('slot1');
    const slot2 = document.getElementById('slot2');
    const slot3 = document.getElementById('slot3');
    const result = document.getElementById('result');

    // 3D dönüş efektini başlat
    slot1.classList.add('spin-animation');
    slot2.classList.add('spin-animation');
    slot3.classList.add('spin-animation');

    // Animasyonu bir süre sonra durdurmak için
    setTimeout(() => {
        slot1.classList.remove('spin-animation');
        slot2.classList.remove('spin-animation');
        slot3.classList.remove('spin-animation');

        // Rastgele semboller seç
        slot1.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        slot2.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        slot3.innerText = symbols[Math.floor(Math.random() * symbols.length)];

        // Sonucu kontrol et
        if (slot1.innerText === slot2.innerText && slot2.innerText === slot3.innerText) {
            result.innerText = "🎉 You Win! 🎉";
        } else {
            result.innerText = "Try Again!";
        }
    }, 1000); // 1 saniye sonra animasyonu durdur ve sonuçları göster
}
