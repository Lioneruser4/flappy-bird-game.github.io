const numbers = [
    32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
    16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26, 0
];

function createNumbers() {
    const wheel = document.getElementById('wheel');
    for (let i = 0; i < 37; i++) {
        const numberElement = document.createElement('div');
        numberElement.className = 'number';
        numberElement.innerText = numbers[i];
        const angle = (i * 360) / 37;
        numberElement.style.transform = `rotate(${angle}deg) translate(160px) rotate(-${angle}deg)`;
        wheel.appendChild(numberElement);
    }
}

let deg = 0;

function spin() {
    const betNumber = parseInt(document.getElementById("bet-number").value, 10);
    if (isNaN(betNumber) || betNumber < 0 || betNumber > 36) {
        alert("Lütfen 0 ile 36 arasında bir sayı girin.");
        return;
    }

    document.getElementById("result").innerText = "";
    const wheel = document.getElementById("wheel");
    const ball = document.getElementById("ball");
    deg = Math.floor(5000 + Math.random() * 5000);
    const realDeg = deg % 360;
    wheel.style.transform = `rotate(${deg}deg)`;

    setTimeout(() => {
        const sector = Math.floor(realDeg / (360 / 37));
        const resultNumber = numbers[sector];
        document.getElementById("result").innerText = `Kazanan numara: ${resultNumber}`;

        const ballAngle = realDeg + (Math.random() * 30 - 15);
        ball.style.top = `${50 + 40 * Math.sin(ballAngle * Math.PI / 180)}%`;
        ball.style.left = `${50 - 40 * Math.cos(ballAngle * Math.PI / 180)}%`;

        if (resultNumber === betNumber) {
            document.getElementById("result").innerText += " - Tebrikler, kazandınız!";
        } else {
            document.getElementById("result").innerText += " - Maalesef, kaybettiniz.";
        }
    }, 4000);
}

createNumbers();
