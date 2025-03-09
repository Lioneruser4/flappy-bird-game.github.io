const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const gameOverMessage = document.getElementById("game-over-message");

const gridSize = 20; // Kare boyutu
let tileCount = 20; // Başlangıçta kare sayısı
let snake = [{ x: 10, y: 10 }]; // Yılanın başlangıç pozisyonu
let food = { x: 5, y: 5 }; // Yem pozisyonu
let direction = { x: 0, y: 0 }; // Yılanın hareket yönü
let score = 0;
let speed = 5; // Yılanın hızı
let gameOver = false;

// Oyun alanını çiz
function drawGame() {
    if (gameOver) {
        gameOverMessage.classList.remove("hidden");
        return;
    }

    // Oyun alanını temizle
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Yılanı çiz
    ctx.fillStyle = "lime";
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    // Yemi çiz
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // Skoru güncelle
    scoreDisplay.textContent = `Skor: ${score}`;
}

// Yılanı hareket ettir
function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Yılan kendi kuyruğuna çarparsa oyun biter
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver = true;
        return;
    }

    // Yılan yemi yerse
    if (head.x === food.x && head.y === food.y) {
        score++;
        speed += 0.5; // Hızı artır
        tileCount++; // Oyun alanını büyüt
        canvas.width = tileCount * gridSize;
        canvas.height = tileCount * gridSize;
        placeFood();
    } else {
        snake.pop(); // Kuyruğu kısalt
    }

    snake.unshift(head); // Yeni başı ekle
}

// Yemi rastgele yerleştir
function placeFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    // Yem yılanın üzerine gelirse yeniden yerleştir
    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        placeFood();
    }
}

// Klavye kontrolleri
window.addEventListener("keydown", e => {
    if (gameOver) {
        // Oyun bittiyse yeniden başlat
        snake = [{ x: 10, y: 10 }];
        direction = { x: 0, y: 0 };
        score = 0;
        speed = 5;
        tileCount = 20;
        canvas.width = tileCount * gridSize;
        canvas.height = tileCount * gridSize;
        gameOver = false;
        gameOverMessage.classList.add("hidden");
        placeFood();
    }

    switch (e.key) {
        case "ArrowUp":
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

// Oyun döngüsü
function gameLoop() {
    if (!gameOver) {
        moveSnake();
        drawGame();
        setTimeout(gameLoop, 1000 / speed); // Hızı ayarla
    }
}

// Oyunu başlat
canvas.width = tileCount * gridSize;
canvas.height = tileCount * gridSize;
placeFood();
gameLoop();
