let balance = 100; // Başlangıç bakiyesi
let betAmount = 1; // Başlangıç bahis miktarı
const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');
const winSound = document.getElementById('winSound');
const message = document.getElementById('message');
const balanceAmount = document.getElementById('balanceAmount');

const fruits = ['🍒', '🍋', '🍉', '🍇', '🍓', '🍑', '🍍']; // Meyve simgeleri

function setBet(amount) {
    betAmount = amount;
    message.innerText = `Bahis Miktarı: ${amount}$`;
}

function spin() {
    if (balance < betAmount) {
        message.innerText = 'Yetersiz bakiye!';
        return;
    }

    balance -= betAmount;
    balanceAmount.innerText = balance;

    const result1 = fruits[Math.floor(Math.random() * fruits.length)];
    const result2 = fruits[Math.floor(Math.random() * fruits.length)];
    const result3 = fruits[Math.floor(Math.random() * fruits.length)];

    reel1.innerText = result1;
    reel2.innerText = result2;
    reel3.innerText = result3;

    checkWin(result1, result2, result3);
}

function checkWin(result1, result2, result3) {
    if (result1 === result2 && result2 === result3) {
        winSound.play();
        balance += betAmount * 5;
        balanceAmount.innerText = balance;
        message.innerText = 'Tebrikler! Kazandınız!';
    } else {
        message.innerText = '';
    }
}
