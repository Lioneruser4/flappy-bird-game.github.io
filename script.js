const symbols = ["🍒", "🔔", "⭐", "🍋", "🍉", "💎", "🎰"]; // Bonus icon: 💎
const bonusIcon = "💎";
let spinButton = document.getElementById("spinButton");
let message = document.getElementById("message");
let freeSpins = 0;
let winChance = 70; // Kazanma şansı yüzde 70

function getRandomSymbol() {
  const chance = Math.random() * 100;
  if (chance < winChance) {
    return symbols[Math.floor(Math.random() * symbols.length)];
  }
  return bonusIcon;
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
    if (r1 === bonusIcon) {
      freeSpins += 10;
      message.innerText = `Jackpot! 10 Free Spins! (Toplam Ücretsiz Spin: ${freeSpins})`;
    } else {
      message.innerText = "Kazandınız!";
    }
  } else {
    if (freeSpins > 0) {
      freeSpins--;
      message.innerText = `Ücretsiz Spin Hakkı Kullanıldı! Kalan: ${freeSpins}`;
    } else {
      message.innerText = "Tekrar Deneyin!";
    }
  }
}

spinButton.addEventListener("click", spinReels);
