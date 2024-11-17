let betAmount = 1; // Başlangıç bahis miktarı

function verifyCode() {
    const accessCode = document.getElementById('accessCode').value;
    if (accessCode === '1234') { // Doğru kodu buraya girin
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'block';
    } else {
        alert('Hatalı Kod!');
    }
}

function setBet(amount) {
    betAmount = amount;
    alert(`Bahis Miktarı: ${amount}`);
}

function spinWheel() {
    const wheelImage = document.getElementById('wheelImage');
    const balanceElement = document.getElementById('balanceAmount');
    let balance = parseInt(balanceElement.innerText);

    const sectors = [
        { multiplier: 1, label: "1x" },
        { multiplier: 2, label: "2x" },
        { multiplier: 3, label: "3x" },
        { multiplier: 4, label: "4x" },
        { multiplier: 5, label: "5x" },
        { multiplier: 6, label: "6x" },
        { multiplier: 7, label: "7x" },
        { multiplier: 8, label: "8x" },
        { multiplier: 9, label: "9x" },
        { multiplier: 10, label: "10x" },
        { multiplier: 0, label: "❌" }
    ];

    const randomSector = sectors[Math.floor(Math.random() * sectors.length)];

    // Çarkı döndürme animasyonu
    const spinAngle = Math.random() * 360 + 360 * 3; // En az 3 tur döner
    let currentAngle = 0;

    const spin = setInterval(() => {
        currentAngle += 10;
        wheelImage.style.transform = `rotate(${currentAngle}deg)`;
        
        if (currentAngle >= spinAngle) {
            clearInterval(spin);
            if (randomSector.multiplier === 0) {
                alert("Kaybettiniz!");
            } else {
                balance += betAmount * randomSector.multiplier;
                alert(`Tebrikler! ${randomSector.label} kazandınız!`);
            }
            balanceElement.innerText = balance;
            wheelImage.style.transform = "rotate(0deg)"; // Çarkı sıfırlayın
        }
    }, 30);
}
