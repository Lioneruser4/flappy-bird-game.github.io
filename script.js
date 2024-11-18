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

    // Çarkları sırayla döndür ve durdur
    spinReel(reel1, result1, 0);
    spinReel(reel2, result2, 1000);
    spinReel(reel3, result3, 2000);

    // Kazanma kontrolü
    setTimeout(() => {
        checkWin(result1, result2, result3);
    }, 3000); // Tüm çarkların durma süresi
}

function getRandomFruit() {
    return fruits[Math.floor(Math.random() * fruits.length)];
}

function spinReel(reel, result, delay) {
    setTimeout(() => {
        let spins = 10; // Çarkın kaç kez döneceği
        const interval = setInterval(() => {
            const randomFruit = getRandomFruit();
            reel.innerHTML = `<div>${randomFruit}</div>`;
        }, 100); // Döndürme süresi

        setTimeout(() => {
            clearInterval(interval);
            reel.innerHTML = `<div>${result}</div>`;
        }, 1000); // Çarkın durma süresi
    }, delay);
}

function checkWin(result1, result2, result3) {
    const isWin = Math.random() < winProbability;
    if (result1 === result2 && result2 === result3 && isWin) {
        winSound.play();
        balance += betAmount * 5;
        balanceAmount.innerText = balance;
        message.innerText = 'Tebrikler! Kazandınız!';
    } else {
        message.innerText = 'Tekrar deneyin!';
    }
}

// Kazanma olasılığını değiştirme fonksiyonu
function setWinProbability(probability) {
    winProbability = probability;
}
