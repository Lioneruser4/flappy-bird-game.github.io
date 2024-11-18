const symbols = ["🍒", "🔔", "⭐", "🍋", "🍉", "💎", "🎰"]; // Bonus icon: 💎
let spinButton = document.getElementById("spinButton");
let message = document.getElementById("message");

function getRandomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

function spinReels() {
  const reel1 = getRandomSymbol();
  const reel2 = getRandomSymbol();
  const reel3 = getRandomSymbol();

  document.getElementById("reel1").innerText = reel1;
  document.getElementById("reel2").innerText = reel2;
  document.getElementById("reel3").innerText = reel3;

  checkWin(reel1, reel2, reel3);
}

function checkWin(r1, r2, r3) {
  if (r1 === r2 && r2 === r3) {
    if (r1 === "💎") {
      message.innerText = "Jackpot! 10 Free Spins!";
    } else {
      message.innerText = "You Win!";
    }
  } else {
    message.innerText = "Try Again!";
  }
}

spinButton.addEventListener("click", spinReels);
