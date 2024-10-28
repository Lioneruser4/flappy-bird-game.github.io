function playGame() {
  const betAmount = document.getElementById("betAmount").value;
  const guess = document.getElementById("guess").value;
  const resultElement = document.getElementById("result");

  if (!betAmount || !guess || guess < 1 || guess > 36) {
    resultElement.innerHTML = "Lütfen geçerli bir bahis ve tahmin girin.";
    return;
  }

  const winningNumber = Math.floor(Math.random() * 36) + 1;
  if (parseInt(guess) === winningNumber) {
    resultElement.innerHTML = `Tebrikler! Kazandınız! Kazanan sayı ${winningNumber} idi.`;
  } else {
    resultElement.innerHTML = `Maalesef, kaybettiniz. Kazanan sayı ${winningNumber} idi.`;
  }
}
