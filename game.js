const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 300;
canvas.height = 500;

let selectedColor = null;
let balls = [];
let obstacles = [];
let hole = { x: 140, y: 470, width: 20, height: 20 };

// Renk seçimi
document.querySelectorAll('.color-button').forEach(button => {
    button.addEventListener('click', (e) => {
        selectedColor = e.target.getAttribute('data-color');
        document.getElementById('result').textContent = `${selectedColor} rengini seçtiniz!`;
    });
});

// Rastgele top oluşturma fonksiyonu
function createBall() {
    const colors = ['red', 'blue', 'green'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    balls.push({ x: Math.random() * 280, y: 0, radius: 10, color: color });
}

// Rastgele engel oluşturma fonksiyonu
function createObstacle() {
    obstacles.push({ x: Math.random() * 250, y: Math.random() * 400, width: 50, height: 10 });
}

// Topları ekrana çizme fonksiyonu
function drawBalls() {
    balls.forEach(ball => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();
    });
}

// Engelleri çizme fonksiyonu
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = 'gray';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Deliği çizme fonksiyonu
function drawHole() {
    ctx.fillStyle = 'white';
    ctx.fillRect(hole.x, hole.y, hole.width, hole.height);
}

// Topların hareketini güncelleme fonksiyonu
function updateBalls() {
    balls.forEach((ball, index) => {
        ball.y += 2; // Topların aşağıya doğru hareket etmesini sağlıyor

        // Engellere çarpma kontrolü
        obstacles.forEach(obstacle => {
            if (ball.x > obstacle.x && ball.x < obstacle.x + obstacle.width && ball.y + ball.radius > obstacle.y && ball.y - ball.radius < obstacle.y + obstacle.height) {
                ball.y -= 5; // Engel ile çarpışınca geri sekme
            }
        });

        // Topun deliğe düşme kontrolü
        if (ball.y + ball.radius > hole.y && ball.x > hole.x && ball.x < hole.x + hole.width) {
            if (selectedColor === ball.color) {
                document.getElementById('result').textContent = `Kazandınız! ${ball.color} top deliğe düştü!`;
            } else {
                document.getElementById('result').textContent = `Kaybettiniz! ${ball.color} top deliğe düştü!`;
            }
            balls.splice(index, 1); // Topu sil
        }

        // Top ekranın dışına çıkarsa sil
        if (ball.y > canvas.height) {
            balls.splice(index, 1);
        }
    });
}

// Oyun döngüsü (her karede güncelleme)
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Ekranı temizle
    drawBalls();  // Topları çiz
    drawObstacles(); // Engelleri çiz
    drawHole();  // Deliği çiz
    updateBalls();  // Topların pozisyonlarını güncelle
    requestAnimationFrame(gameLoop);  // Sonraki kareyi iste
}

// Oyun başlasın
setInterval(createBall, 1000); // Her 1 saniyede bir top ekle
createObstacle();  // Engelleri ekle
createObstacle();
gameLoop();  // Oyun döngüsünü başlat
