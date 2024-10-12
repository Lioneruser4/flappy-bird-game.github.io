const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Mobil uyum için ekran boyutunu ayarla
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Oyun değişkenleri
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;
let playerX = canvas.width / 2 - PLAYER_WIDTH / 2;
let playerY = canvas.height - PLAYER_HEIGHT - 10;
let playerSpeedX = 5;
let playerSpeedY = 0;
let gravity = 0.5;
let isGameOver = false;
let isWinner = false;

// Bariyerler
let barriers = [
    { x: 0, y: 400, width: canvas.width, height: 20 },
    { x: 0, y: 300, width: canvas.width / 2, height: 20 },
    { x: canvas.width / 2, y: 200, width: canvas.width / 2, height: 20 },
    { x: 0, y: 100, width: canvas.width, height: 20 },
];

// Kazanan mesajı
const winnerMessage = document.getElementById('winnerMessage');

function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(playerX, playerY, PLAYER_WIDTH, PLAYER_HEIGHT);
}

function drawBarriers() {
    ctx.fillStyle = 'red';
    barriers.forEach(barrier => {
        ctx.fillRect(barrier.x, barrier.y, barrier.width, barrier.height);
    });
}

function movePlayer() {
    // Yerçekimi
    playerSpeedY += gravity;
    playerY += playerSpeedY;

    // Ekranın dışına çıkmayı engelle
    if (playerY + PLAYER_HEIGHT > canvas.height) {
        playerY = canvas.height - PLAYER_HEIGHT;
        playerSpeedY = 0;
    }

    // Bariyerler oyuncuyu yukarıya iter
    barriers.forEach(barrier => {
        if (
            playerX < barrier.x + barrier.width &&
            playerX + PLAYER_WIDTH > barrier.x &&
            playerY < barrier.y + barrier.height &&
            playerY + PLAYER_HEIGHT > barrier.y
        ) {
            playerSpeedY = -10; // Oyuncuyu yukarı it
        }
    });

    // Kazanma durumu
    if (playerY <= 0 && !isWinner) {
        isWinner = true;
        isGameOver = true;
        showWinnerMessage();
    }
}

function showWinnerMessage() {
    winnerMessage.style.display = 'block';
}

// Oyun döngüsü
function gameLoop() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawBarriers();
    movePlayer();

    requestAnimationFrame(gameLoop);
}

gameLoop();

// Dokunmatik kontroller (mobil için)
canvas.addEventListener('touchstart', function() {
    playerSpeedY = -10; // Dokununca zıplasın
});

// Ekran boyutları değişirse canvas boyutunu güncelle
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Mobil uyum için ekran boyutunu ayarla
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Oyun değişkenleri
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;
let playerX = canvas.width / 2 - PLAYER_WIDTH / 2;
let playerY = canvas.height - PLAYER_HEIGHT - 10;
let playerSpeedX = 5;
let playerSpeedY = 0;
let gravity = 0.5;
let isGameOver = false;
let isWinner = false;

// Bariyerler
let barriers = [
    { x: 0, y: 400, width: canvas.width, height: 20 },
    { x: 0, y: 300, width: canvas.width / 2, height: 20 },
    { x: canvas.width / 2, y: 200, width: canvas.width / 2, height: 20 },
    { x: 0, y: 100, width: canvas.width, height: 20 },
];

// Kazanan mesajı
const winnerMessage = document.getElementById('winnerMessage');

function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(playerX, playerY, PLAYER_WIDTH, PLAYER_HEIGHT);
}

function drawBarriers() {
    ctx.fillStyle = 'red';
    barriers.forEach(barrier => {
        ctx.fillRect(barrier.x, barrier.y, barrier.width, barrier.height);
    });
}

function movePlayer() {
    // Yerçekimi
    playerSpeedY += gravity;
    playerY += playerSpeedY;

    // Ekranın dışına çıkmayı engelle
    if (playerY + PLAYER_HEIGHT > canvas.height) {
        playerY = canvas.height - PLAYER_HEIGHT;
        playerSpeedY = 0;
    }

    // Bariyerler oyuncuyu yukarıya iter
    barriers.forEach(barrier => {
        if (
            playerX < barrier.x + barrier.width &&
            playerX + PLAYER_WIDTH > barrier.x &&
            playerY < barrier.y + barrier.height &&
            playerY + PLAYER_HEIGHT > barrier.y
        ) {
            playerSpeedY = -10; // Oyuncuyu yukarı it
        }
    });

    // Kazanma durumu
    if (playerY <= 0 && !isWinner) {
        isWinner = true;
        isGameOver = true;
        showWinnerMessage();
    }
}

function showWinnerMessage() {
    winnerMessage.style.display = 'block';
}

// Oyun döngüsü
function gameLoop() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawBarriers();
    movePlayer();

    requestAnimationFrame(gameLoop);
}

gameLoop();

// Dokunmatik kontroller (mobil için)
canvas.addEventListener('touchstart', function() {
    playerSpeedY = -10; // Dokununca zıplasın
});

// Ekran boyutları değişirse canvas boyutunu güncelle
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
