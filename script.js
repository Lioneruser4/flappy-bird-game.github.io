// Giriş kodunu kontrol eden fonksiyon
function verifyCode() {
    const accessCode = document.getElementById('accessCode').value;
    if (accessCode === '1234') { // Doğru kodu buraya girin
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'block';
    } else {
        alert('Hatalı Kod!');
    }
}

// Rulet tekerleğini çeviren fonksiyon
function spinWheel() {
    const balanceElement = document.getElementById('balanceAmount');
    let balance = parseInt(balanceElement.innerText);

    // Rastgele bir çarpan seç (1x, 2x, 3x)
    const multipliers = [1, 2, 3];
    const randomMultiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
    
    balance *= randomMultiplier; // Bakiyeyi çarpanla güncelle

    // Güncellenmiş bakiyeyi göster
    balanceElement.innerText = balance;
    
    alert(`Tebrikler! ${randomMultiplier}x kazandınız!`);
}
