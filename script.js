const ball = document.getElementById('ball');
const gameBoard = document.getElementById('gameBoard');
const multipliers = [1, 1.2, 1.5, 2, 0.5, 1.8, 1.3, 0.7, 1.1, 2.5]; // Çarpanlar

function dropBall() {
    ball.style.display = 'block';
    let topPosition = 0;
    const interval = setInterval(() => {
        topPosition += 5;
        ball.style.top = topPosition + 'px';

        if (topPosition >= gameBoard.clientHeight - ball.clientHeight) {
            clearInterval(interval);
            const randomMultiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
            alert('Kazandığınız çarpan: ' + randomMultiplier);
            ball.style.display = 'none';
            ball.style.top = '0';
        }
    }, 30);
}
