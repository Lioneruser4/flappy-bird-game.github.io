let currentBet = 0;

function bet(amount) {
  currentBet = amount;
  alert(`Bahis miktarınız: ${currentBet} chip`);
}

function spinWheel() {
  if (currentBet === 0) {
    alert("Lütfen bahis yapın!");
    return;
  }

  const result = Math.floor(Math.random() * 37); // Rulet çarkı için 37 sayı
  alert(`Çark döndü! Sonuç: ${result}`);
  currentBet = 0; // Bahis sıfırlanır
}
let currentBet = 0;

function bet(amount) {
  currentBet = amount;
  alert(`Bahis miktarınız: ${currentBet} chip`);
}

function spinWheel() {
  if (currentBet === 0) {
    alert("Lütfen bahis yapın!");
    return;
  }

  const result = Math.floor(Math.random() * 37); // Rulet çarkı için 37 sayı
  alert(`Çark döndü! Sonuç: ${result}`);
  currentBet = 0; // Bahis sıfırlanır
}
