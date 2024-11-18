const spinSound = new Audio('assets/spin.mp3');
const winSound = new Audio('assets/win.mp3');
let loggedIn = false;

function spinReels() {
  spinSound.play();
  const reel1 = randomSymbol();
  const reel2 = randomSymbol();
  const reel3 = randomSymbol();
  document.getElementById("reel1").innerText = reel1;
  document.getElementById("reel2").innerText = reel2;
  document.getElementById("reel3").innerText = reel3;

  if (reel1 === reel2 && reel2 === reel3) {
    winSound.play();
    alert("Kazandınız!");
  }
}

function randomSymbol() {
  const symbols = ["🍒", "🔔", "💎", "🍋", "🍉"];
  return symbols[Math.floor(Math.random() * symbols.length)];
}

function showModal(modalId) {
  document.getElementById(modalId).style.display = "flex";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

function startDemo() {
  loggedIn = true;
  alert("Demo başlıyor!");
}
