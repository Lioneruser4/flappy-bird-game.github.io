const bird = document.getElementById('bird');
const game = document.getElementById('game');
const scoreDisplay = document.getElementById('score');
const scoresList = document.getElementById('scores-list');
let birdY = 200;
let gravity = 1.5;
let score = 0;
let gameInterval;
let obstacleInterval;

// Skorları localStorage'dan yükle
let scores = JSON.parse(localStorage.getItem('flappyBirdScores')) || [];

function startGame() {
    birdY = 200;
    score = 0;
    scoreDisplay.innerText = `Skor: ${score}`;
    game.innerHTML = '<div id="bird"></div><div id="score">Skor: 0</div>';
    bird.style.top = birdY + 'px';
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
    gameInterval = setInterval(updateGame, 20);
    obstacleInterval = setInterval(createObstacle, 2000);
}

function updateGame() {
    birdY += gravity;
    bird.style.top = birdY + 'px';

    // Çarpışma kontrolü
    if (birdY > game.clientHeight - 50 || birdY < 0) {
        endGame();
    }

    // Engelleri kontrol et
    const obstacles = document.querySelectorAll('.obstacle');
    obstacles.forEach(obstacle => {
        const obstacleX = obstacle.offsetLeft;
        const obstacleY = obstacle.offsetTop;
        if (
            obstacleX < 100 && obstacleX > 50 &&
            (birdY < obstacleY || birdY > obstacleY + 150)
        ) {
            endGame();
        }
        if (obstacleX === 50) {
            score++;
            scoreDisplay.innerText = `Skor: ${score}`;
        }
    });
}

function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.className = 'obstacle';
    obstacle.style.left = game.clientWidth + 'px';
    obstacle.style.top = Math.random() * (game.clientHeight - 200) + 'px';
    game.appendChild(obstacle);

    let obstacleX = game.clientWidth;
    const obstacleMove = setInterval(() => {
        obstacleX -= 5;
        obstacle.style.left = obstacleX + 'px';
        if (obstacleX < -50) {
            clearInterval(obstacleMove);
            obstacle.remove();
        }
    }, 20);
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
    alert(`Oyun Bitti! Skorunuz: ${score}`);
    saveScore(score);
    startGame();
}

function saveScore(score) {
    const userId = new URLSearchParams(window.location.search).get('user_id') || 'Anonim';
    scores.push({ user: userId, score: score });
    scores.sort((a, b) => b.score - a.score); // Skorları sırala
    localStorage.setItem('flappyBirdScores', JSON.stringify(scores));
    updateLeaderboard();
}

function updateLeaderboard() {
    scoresList.innerHTML = '';
    scores.slice(0, 10).forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `${entry.user}: ${entry.score} puan`;
        scoresList.appendChild(li);
    });
}

document.addEventListener('keydown', () => {
    birdY -= 40;
});

// Sayfa yüklendiğinde skor tablosunu güncelle
updateLeaderboard();
startGame();
