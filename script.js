const dino = document.getElementById('dino');
const game = document.getElementById('game');
const scoreDisplay = document.getElementById('score');
const obstaclesContainer = document.getElementById('obstacles');
const showLeaderboardButton = document.getElementById('show-leaderboard');
const leaderboardPopup = document.getElementById('leaderboard-popup');
const closeLeaderboardButton = document.getElementById('close-leaderboard');
const scoresList = document.getElementById('scores-list');
let isJumping = false;
let gravity = 1.5;
let jumpStrength = -30;
let score = 0;
let gameInterval;
let obstacleInterval;
let isGameOver = false;
let gameSpeed = 5;  // Oyun hızı

// Skorları localStorage'dan yükle
let scores = JSON.parse(localStorage.getItem('dinoScores')) || [];

function startGame() {
    isJumping = false;
    score = 0;
    isGameOver = false;
    gameSpeed = 5;  // Başlangıç hızı
    scoreDisplay.innerText = `Skor: ${score}`;
    obstaclesContainer.innerHTML = '';
    dino.style.bottom = '0';
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
    gameInterval = setInterval(updateGame, 20);
    obstacleInterval = setInterval(createObstacle, 1500);
}

function updateGame() {
    if (isGameOver) return;

    // Yerçekimi etkisi
    if (isJumping) {
        dino.style.bottom = parseInt(dino.style.bottom) - gravity + 'px';
    } else {
        dino.style.bottom = Math.max(0, parseInt(dino.style.bottom) - gravity) + 'px';
    }

    // Engelleri kontrol et
    const obstacles = document.querySelectorAll('.obstacle');
    obstacles.forEach(obstacle => {
        const obstacleX = obstacle.offsetLeft;
        const obstacleY = obstacle.offsetTop;

        if (
            obstacleX < 100 && obstacleX > 50 &&
            parseInt(dino.style.bottom) < 50  // Dino'nun bariyere çarpması
        ) {
            endGame();
        }

        // Skor artırma
        if (obstacleX === 50) {
            score++;
            scoreDisplay.innerText = `Skor: ${score}`;
            gameSpeed += 0.2;  // Oyun hızını artır
        }
    });
}

function createObstacle() {
    if (isGameOver) return;

    const obstacle = document.createElement('div');
    obstacle.className = 'obstacle';
    obstacle.style.left = game.clientWidth + 'px';
    obstacle.style.bottom = '0';

    obstaclesContainer.appendChild(obstacle);

    let obstacleX = game.clientWidth;
    const obstacleMove = setInterval(() => {
        if (isGameOver) {
            clearInterval(obstacleMove);
            return;
        }

        obstacleX -= gameSpeed;  // Oyun hızına göre hareket
        obstacle.style.left = obstacleX + 'px';

        if (obstacleX < -40) {
            clearInterval(obstacleMove);
            obstacle.remove();
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
    const userIndex = scores.findIndex(entry => entry.user === userId);

    if (userIndex === -1) {
        scores.push({ user: userId, score: score });
    } else if (score > scores[userIndex].score) {
        scores[userIndex].score = score;  // Sadece en yüksek skoru kaydet
    }

    scores.sort((a, b) => b.score - a.score);  // Skorları sırala
    localStorage.setItem('dinoScores', JSON.stringify(scores));
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

// Zıplama
document.addEventListener('keydown', () => {
    if (!isJumping && !isGameOver) {
        isJumping = true;
        setTimeout(() => (isJumping = false), 500);  // Zıplama süresi
    }
});

// Dokunma ile zıplama
document.addEventListener('touchstart', () => {
    if (!isJumping && !isGameOver) {
        isJumping = true;
        setTimeout(() => (isJumping = false), 500);  // Zıplama süresi
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
