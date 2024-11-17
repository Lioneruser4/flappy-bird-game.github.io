let betAmount = 1; // Başlangıç bahis miktarı

function verifyCode() {
    const accessCode = document.getElementById('accessCode').value;
    if (accessCode === '0000') { // Doğru kodu buraya girin
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'block';
        drawRouletteWheel();
    } else {
        alert('Hatalı Kod!');
    }
}

function setBet(amount) {
    betAmount = amount;
    alert(`Bahis Miktarı: ${amount}`);
}

function drawRouletteWheel() {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const sectors = [
        "1x", "2x", "3x", "4x", "5x", "6x", "7x", "8x", "9x", "10x", "❌"
    ];
    const colors = [
        "red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan", "brown", "magenta", "black"
    ];
    const numSectors = sectors.length;
    const anglePerSector = (2 * Math.PI) / numSectors;

    for (let i = 0; i < numSectors; i++) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, i * anglePerSector, (i + 1) * anglePerSector);
        ctx.closePath();
        ctx.fillStyle = colors[i];
        ctx.fill();
        ctx.stroke();

        // Sektör metni
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(i * anglePerSector + anglePerSector / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText(sectors[i], canvas.width / 2 - 10, 10);
        ctx.restore();
    }
}

function spinWheel() {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((currentAngle * Math.PI) / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        drawRouletteWheel();
        ctx.restore();

        if (currentAngle >= spinAngle) {
            clearInterval(spin);
            if (randomSector.multiplier === 0) {
                alert("Kaybettiniz!");
            } else {
                balance += betAmount * randomSector.multiplier;
                alert(`Tebrikler! ${randomSector.label} kazandınız!`);
            }
            balanceElement.innerText = balance;
        }
    }, 30);
}
