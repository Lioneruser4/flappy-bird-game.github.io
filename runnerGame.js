const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Mobil uyum için ekran boyutunu ayarla
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const GRAVITY = 0.8;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;
let playerY = canvas.height - PLAYER_HEIGHT;
let playerX = 50;
let playerSpeedY = 0;
let jumping = false;
let obstacles = [];
let score = 0;
let gameOver = false;
const scoreElement = document.getElementById('score');

// Engeller
class Obstacle {
    constructor() {
        this.width = 50;
        this.height = 50;
        this.x = canvas.width;
        this.y = canvas.height - this.height;
        this.speed = 6;
    }

    move() {
        this.x -= this.speed;
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Oyuncu çizimi
function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(playerX, playerY, PLAYER_WIDTH, PLAYER_HEIGHT);
}

// Oyuncu hareketleri
function movePlayer() {
    if (jumping) {
        playerSpeedY -= GRAVITY;
        playerY += playerSpeedY;

        if (playerY > canvas.height - PLAYER_HEIGHT) {
            playerY = canvas.height - PLAYER_HEIGHT;
            jumping = false;
            playerSpeedY = 0;
        }
    }
}

// Engelleri hareket ettir
function moveObstacles() {
    obstacles.forEach((obstacle, index) => {
        obstacle.move();
        obstacle.draw();

        // Eğer engel ekran dışına çıkarsa, onu kaldır ve skoru artır
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
            score++;
            scoreElement.textContent = `Skor: ${score}`;
        }

        // Oyuncu ve engel çarpışma kontrolü
        if (
            playerX < obstacle.x + obstacle.width &&
            playerX + PLAYER_WIDTH > obstacle.x &&
            playerY < obstacle.y + obstacle.height &&
            playerY + PLAYER_HEIGHT > obstacle.y
        ) {
            gameOver = true;
        }
    });
}

// Oyun döngüsü
function gameLoop() {
    if (gameOver) {
        alert("Oyun Bitti! Skor: " + score);
        document.location.reload();
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPlayer();
        movePlayer();
        moveObstacles();

        // Her 150 frame'de bir yeni engel ekle
        if (Math.random() < 0.01) {
            obstacles.push(new Obstacle());
        }

        requestAnimationFrame(gameLoop);
    }
}

// Oyuncu zıplama işlemi
window.addEventListener('keydown', function (e) {
    if (e.code === 'Space' && !jumping) {
        jumping = true;
        playerSpeedY = -15; // Zıplama yüksekliği
    }
});

// Dokunmatik kontroller (mobil için)
canvas.addEventListener('touchstart', function () {
    if (!jumping) {
        jumping = true;
        playerSpeedY = -15;
    }
});

// Oyun başlasın
gameLoop();
