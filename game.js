function spin() {
    const symbols = ['🍒', '🍋', '🍊', '🍉', '⭐', '🔔'];
    const result = document.getElementById('result');
    
    const slot1 = document.getElementById('slot1');
    const slot2 = document.getElementById('slot2');
    const slot3 = document.getElementById('slot3');

    // Slotların rastgele sembolleri döndürmesi için rastgele animasyon süreleri belirliyoruz
    let duration1 = Math.random() * 2000 + 1000;
    let duration2 = Math.random() * 2000 + 1000;
    let duration3 = Math.random() * 2000 + 1000;

    // Slotları döndürürken animasyon sürelerini uyguluyoruz
    slot1.style.animation = `spin ${duration1 / 1000}s ease-out`;
    slot2.style.animation = `spin ${duration2 / 1000}s ease-out`;
    slot3.style.animation = `spin ${duration3 / 1000}s ease-out`;

    setTimeout(() => {
        // Slotların duracağı sembolleri belirliyoruz
        slot1.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        slot2.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        slot3.innerText = symbols[Math.floor(Math.random() * symbols.length)];

        // Sonuçları kontrol ediyoruz
        if (slot1.innerText === slot2.innerText && slot2.innerText === slot3.innerText) {
            result.innerText = "🎉 You Win! 🎉";
        } else {
            result.innerText = "Try Again!";
        }
    }, Math.max(duration1, duration2, duration3)); // En uzun sürede durmasını bekliyoruz
}
