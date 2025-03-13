const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("start-button");
const scoreSpan = document.getElementById("score");

canvas.width = 400; // Genişlik
canvas.height = 400; // Yükseklik

let score = 0;
let pacman = { x: 50, y: 50, size: 20, dx: 0, dy: 0 }; // Pac-Man'in başlangıç durumu
let dots = []; // Yenecek noktalar

// Yiyecekler (dots) yarat
function createDots() {
    for (let i = 0; i < 10; i++) {
        let x = Math.floor(Math.random() * (canvas.width - 20));
        let y = Math.floor(Math.random() * (canvas.height - 20));
        dots.push({ x: x, y: y, size: 10 });
    }
}

// Pac-Man hareketi
function movePacman() {
    pacman.x += pacman.dx;
    pacman.y += pacman.dy;

    // Sınırları kontrol et
    if (pacman.x < 0) pacman.x = 0;
    if (pacman.y < 0) pacman.y = 0;
    if (pacman.x > canvas.width - pacman.size) pacman.x = canvas.width - pacman.size;
    if (pacman.y > canvas.height - pacman.size) pacman.y = canvas.height - pacman.size;
}

// Yiyecekleri kontrol et ve Pac-Man ile çarpışma
function checkCollision() {
    dots = dots.filter(dot => {
        if (pacman.x < dot.x + dot.size &&
            pacman.x + pacman.size > dot.x &&
            pacman.y < dot.y + dot.size &&
            pacman.y + pacman.size > dot.y) {
            score += 10; // Puanı arttır
            scoreSpan.textContent = score; // Ekranda güncelle
            return false; // Bu noktayı çıkar
        }
        return true; // Bu noktayı tut
    });
}

// Oyun alanını çiz
function drawGame() {
    // Arka planı temizle
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Pac-Man
    ctx.beginPath();
    ctx.arc(pacman.x, pacman.y, pacman.size, 0, 2 * Math.PI);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();

    // Yiyecekleri çiz
    ctx.fillStyle = "white";
    dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    });

    // Eğer tüm noktalar yendiyse
    if (dots.length === 0) {
        alert("Tüm noktalar yenildi! Yeni oyuna başla.");
        resetGame();
    }
}

// Oyunu başlat
function startGame() {
    pacman = { x: 50, y: 50, size: 20, dx: 0, dy: 0 }; // Başlangıç durumuna resetle
    score = 0;
    scoreSpan.textContent = score;
    dots = [];
    createDots();
    gameLoop();
}

// Oyun döngüsü
function gameLoop() {
    movePacman();
    checkCollision();
    drawGame();
    requestAnimationFrame(gameLoop);
}

// Yön tuşlarıyla hareket etme
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") pacman.dy = -2;
    if (e.key === "ArrowDown") pacman.dy = 2;
    if (e.key === "ArrowLeft") pacman.dx = -2;
    if (e.key === "ArrowRight") pacman.dx = 2;
});

// Yön tuşları serbest bırakıldığında durdur
document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") pacman.dy = 0;
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") pacman.dx = 0;
});

// Yeni oyun başlat
startButton.addEventListener("click", startGame);

function resetGame() {
    pacman = { x: 50, y: 50, size: 20, dx: 0, dy: 0 };
    dots = [];
    createDots();
    score = 0;
    scoreSpan.textContent = score;
    gameLoop();
}
