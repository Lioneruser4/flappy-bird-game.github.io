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

let winProbability = 0.7; // Kazanma olasılığı (%70)

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

    const result1 = getRandomFruit();
    const result2 = getRandomFruit();
    const result3 = getRandomFruit();

    setTimeout(() => {
        animateReel(reel1, result1);
    }, 0);

    setTimeout(() => {
        animateReel(reel2, result2);
    }, 1000);

    setTimeout(() => {
        animateReel(reel3, result3);
        setTimeout(() => {
            checkWin(result1, result2, result3);
        }, 1000); // Çark durma süresi
    }, 2000);
}

function getRandomFruit() {
    return fruits[Math.floor(Math.random() * fruits.length)];
}

function animateReel(reel, result) {
    reel.innerHTML = `<div>${result}</div>`;
    reel.style.animation = 'none'; // Animasyonu durdur
    setTimeout(() => {
        reel.style.animation = ''; // Animasyonu yeniden başlat
    }, 10);
}

function checkWin(result1, result2, result3) {
    const isWin = Math.random() < winProbability;
    if (isWin && result1 === result2 && result2 === result3) {
        winSound.play();
        balance += betAmount * 5;
        balanceAmount.innerText = balance;
        message.innerText = 'Tebrikler! Kazandınız!';
    } else {
        message.innerText = '';
    }
}

// Kazanma olasılığını değiştirme fonksiyonu
function setWinProbability(probability) {
    winProbability = probability;
}
