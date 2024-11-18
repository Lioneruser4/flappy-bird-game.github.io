let balance = 100; // Başlangıç bakiyesi
let betAmount = 1; // Başlangıç bahis miktarı
const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');
const winSound = document.getElementById('winSound');
const spinSound = document.getElementById('spinSound');
const message = document.getElementById('message');
const balanceAmount = document.getElementById('balanceAmount');

const fruits = ['🍒', '🍋', '🍉', '🍇', '🍓', '🍑', '🍍']; // Meyve simgeleri
const winProbability = 0.7; // Kazanma olasılığı

function setBet(amount) {
    betAmount = amount;
    message.innerText = `Bahis Miktarı: ${amount}$`;
}

function spin() {
    if (balance < betAmount) {
        message.innerText = 'Yetersiz bakiye!';
        return;
    }

    // Spin sesini çal
    spinSound.play();

    balance -= betAmount;
    balanceAmount.innerText = balance;

    const isWinning = Math.random() < winProbability;
    const winningFruit = fruits[Math.floor(Math.random() * fruits.length)];
    const result1 = isWinning ? winningFruit : fruits[Math.floor(Math.random() * fruits.length)];
    const result2 = isWinning ? winningFruit : fruits[Math.floor(Math.random() * fruits.length)];
    const result3 = isWinning ? winningFruit : fruits[Math.floor(Math.random() * fruits.length)];

    animateReel(reel1, result1, 0);
    animateReel(reel2, result2, 1000);
    animateReel(reel3, result3, 2000);

    setTimeout(() => {
        checkWin(result1, result2, result3);
    }, 3000); // Animasyon süresi (3 saniye)
}

function animateReel(reel, result, delay) {
    setTimeout(() => {
        reel.innerHTML = `<div>${result}</div>`;
    }, delay);
}

function checkWin(result1, result2, result3) {
    if (result1 === result2 && result2 === result3) {
        win
