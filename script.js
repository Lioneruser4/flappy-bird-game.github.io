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

    const result1 = fruits[Math.floor(Math.random() * fruits.length)];
    const result2 = fruits[Math.floor(Math.random() * fruits.length)];
    const result3 = fruits[Math.floor(Math.random() * fruits.length)];

    animateReel(reel1, result1);
    animateReel(reel2, result2);
    animateReel(reel3, result3);

    setTimeout(() => {
        checkWin(result1, result2, result3);
    }, 2000); // Animasyon süresi
}

function animateReel(reel, result) {
    reel.innerHTML = `<div>${result}</div>`;
    reel.style.animation = 'none'; // Animasyonu durdur
    setTimeout(() => {
        reel.style.animation = ''; // Animasyonu yeniden başlat
    }, 10);
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
