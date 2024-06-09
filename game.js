const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width = window.innerWidth;
const HEIGHT = canvas.height = window.innerHeight;

const playerWidth = 100;
const playerHeight = 20;
const ballSize = 10;

let playerX = (WIDTH - playerWidth) / 2;
const playerY = HEIGHT - 50;
let ballX = WIDTH / 2;
let ballY = HEIGHT / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  
  // Draw player
  ctx.fillStyle = "#000";
  ctx.fillRect(playerX, playerY, playerWidth, playerHeight);
  
  // Draw ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
  ctx.fillStyle = "#000";
  ctx.fill();
  
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  
  if (ballX <= 0 || ballX >= WIDTH) {
    ballSpeedX = -ballSpeedX;
  }
  
  if (ballY <= 0 || (ballY >= playerY && ballX >= playerX && ballX <= playerX + playerWidth)) {
    ballSpeedY = -ballSpeedY;
  } else if (ballY > HEIGHT) {
    // Ball out of bounds, reset position
    ballX = WIDTH / 2;
    ballY = HEIGHT / 2;
  }
  
  requestAnimationFrame(draw);
}

draw();

// Move player with touch
canvas.addEventListener("touchmove", function(event) {
  playerX = event.touches[0].clientX - playerWidth / 2;
});
