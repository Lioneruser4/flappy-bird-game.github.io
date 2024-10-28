const numbers = [
    32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
    16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

function createNumbers() {
    const wheel = document.getElementById('wheel');
    for (let i = 0; i < 36; i++) {
        const numberElement = document.createElement('div');
        numberElement.className = 'number';
        numberElement.innerText = numbers[i];
        const angle = (i * 360) / 36;
        numberElement.style.transform = `rotate(${angle}deg) translate(130px) rotate(-${angle}deg)`;
        wheel.appendChild(numberElement);
    }
}

let deg = 0;

function spin() {
    document.getElementById("result").innerText = "";
    const wheel = document.getElementById("wheel");
    const ball = document.getElementById("ball");
    deg = Math.floor(5000 + Math.random() * 5000);
    const realDeg = deg % 360;
    wheel.style.transform = `rotate(${deg}deg)`;

    setTimeout(() => {
        const sector = Math.floor(realDeg / 10);
        const resultNumber = numbers[sector % 36];
        document.getElementById("result").innerText = `Kazanan numara: ${resultNumber}`;

        const ballAngle = realDeg + (Math.random() * 30 - 15);
        ball.style.top = `${142.5 + 130 * Math.sin(ballAngle * Math.PI / 180)}px`;
        ball.style.left = `${142.5 - 130 * Math.cos(ballAngle * Math.PI / 180)}px`;
    }, 4000);
}

createNumbers();
