const bird = document.getElementById('bird');
const game = document.getElementById('game');
const scoreDisplay = document.getElementById('score');
const obstaclesContainer = document.getElementById('obstacles');
const showLeaderboardButton = document.getElementById('show-leaderboard');
const leaderboardPopup = document.getElementById('leaderboard-popup');
const closeLeaderboardButton = document.getElementById('close-leaderboard');
const scoresList = document.getElementById('scores-list');
let birdY = 200;
let gravity = 1.5;
let jumpStrength = -30;
let score = 0;
let gameInterval;
let obstacleInterval;
let isGameOver = false;

// Skorları localStorage'dan yükle
let scores = JSON.parse(localStorage.getItem('flappyBirdScores')) || [];

function startGame() {
    birdY = 200;
    score = 0;
    isGameOver = false;
    scoreDisplay.innerText = `Skor: ${score}`;
    obstaclesContainer.innerHTML = '';
    bird.style.top = birdY + 'px';
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
    gameInterval = setInterval(updateGame, 20);
    obstacleInterval = setInterval(createObstacle, 2000);
}

function updateGame() {
    if (isGameOver) return;

    // Yerçekimi etkisi
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
        const gap = 150; // Bariyerler arası boşluk

        if (
            obstacleX < 100 && obstacleX > 50 &&
            (birdY < obstacleY || birdY > obstacleY + gap)
        ) {
            endGame();
        }

        // Skor artırma
        if (obstacleX === 50) {
            score++;
            scoreDisplay.innerText = `Skor: ${score}`;
        }
    });
}

function createObstacle() {
    if (isGameOver) return;

    const obstacleTop = document.createElement('div');
    const obstacleBottom = document.createElement('div');
    const gap = 150; // Bariyerler arası boşluk
    const randomHeight = Math.random() * (game.clientHeight - gap);

    obstacleTop.className = 'obstacle';
    obstacleBottom.className = 'obstacle';

    obstacleTop.style.top = '0';
    obstacleTop.style.left = game.clientWidth + 'px';
    obstacleTop.style.height = randomHeight + 'px';

    obstacleBottom.style.top = randomHeight + gap + 'px';
    obstacleBottom.style.left = game.clientWidth + 'px';
    obstacleBottom.style.height = game.clientHeight - (randomHeight + gap) + 'px';

    obstaclesContainer.appendChild(obstacleTop);
    obstaclesContainer.appendChild(obstacleBottom);

    let obstacleX = game.clientWidth;
    const obstacleMove = setInterval(() => {
        if (isGameOver) {
            clearInterval(obstacleMove);
            return;
        }

        obstacleX -= 5;
        obstacleTop.style.left = obstacleX + 'px';
        obstacleBottom.style.left = obstacleX + 'px';

        if (obstacleX < -60) {
            clearInterval(obstacleMove);
            obstacleTop.remove();
            obstacleBottom.remove();
        }
    }, 20);
}

function endGame() {
    isGameOver = true;
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

// Kuşu zıplat
document.addEventListener('keydown', () => {
    if (!isGameOver) {
        birdY += jumpStrength;
    }
});

// Skor tablosunu göster
showLeaderboardButton.addEventListener('click', () => {
    leaderboardPopup.style.display = 'flex';
});

// Skor tablosunu kapat
closeLeaderboardButton.addEventListener('click', () => {
    leaderboardPopup.style.display = 'none';
});

// Sayfa yüklendiğinde skor tablosunu güncelle
updateLeaderboard();
startGame();
