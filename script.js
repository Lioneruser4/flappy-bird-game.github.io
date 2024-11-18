let balance = 100; // Başlangıç bakiyesi
let betAmount = 1; // Başlangıç bahis miktarı
let freeSpins = 0; // Ücretsiz çevirme sayısı
const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');
const winSound = document.getElementById('winSound');
const spinSound = document.getElementById('spinSound');
const bonusSound = document.getElementById('bonusSound');
const message = document.getElementById('message');
const balanceAmount = document.getElementById('balanceAmount');
const spinButton = document.getElementById('spinButton');
const betPopup = document.getElementById('betPopup');
const bonusPopup = document.getElementById('bonusPopup');

const fruits = ['🍒', '🍋', '🍉', '🍇', '🍓', '🍑', '🍍', '🎁']; // Meyve simgeleri, bonus için 🎁 eklendi

let winProbability = 0.7; // Kazanma olasılığı (%70)

function setBet(amount) {
    betAmount = amount;
    message.innerText = `Bahis Miktarı: ${amount}$`;
    closeBetPopup();
}

function spin() {
    if (balance < betAmount && freeSpins === 0) {
        message.innerText = 'Yetersiz bakiye!';
        return;
    }

    // Spin sesini çal
    spinSound.play();
    spinButton.disabled = true;

    if (freeSpins === 0) {
        balance -= betAmount;
    } else {
        freeSpins--;
    }

    balanceAmount.innerText = balance;

    const result1 = getRandomFruit();
    const result2 = getRandomFruit();
    const result3 = getRandomFruit();

    // Çarkları sırayla döndür ve durdur
    spinReel(reel1, result1, 0);
    spinReel(reel2, result2, 500);
    spinReel(reel3, result3, 1000);

    // Kazanma kontrolü
    setTimeout(() => {
        checkWin(result1, result2, result3);
        spinButton.disabled = false;
    }, 1500); // Tüm çarkların durma süresi
}

function getRandomFruit() {
    return fruits[Math.floor(Math.random() * fruits.length)];
}

function spinReel(reel, result, delay) {
    let spins = 10; // Çarkın kaç kez döneceği
    setTimeout(() => {
        const interval = setInterval(() => {
            const randomFruit = getRandomFruit();
            reel.innerHTML = `<div>${randomFruit}</div>`;
            spins--;

            if (spins === 0) {
                clearInterval(interval);
                reel.innerHTML = `<div>${result}</div>`;
            }
        }, 100); // Döndürme süresi
    }, delay);
}

function checkWin(result1, result2, result3) {
    const isWin = Math.random() < winProbability;
    if (result1 === result2 && result2 === result3) {
        if (result1 === '🎁') {
            bonusSound.play();
            freeSpins += 15;
            openBonusPopup();
        } else if (isWin) {
            winSound.play();
            balance += betAmount * 5;
            balanceAmount.innerText = balance;
            message.innerText = 'Tebrikler! Kazandınız!';
        }
    } else {
        message.innerText = '';
   [43dcd9a7-70db-4a1f-b0ae-981daa162054](https://github.com/EleanorEllingson/web-dev/tree/b2f2a382e77a20fd6895677c8b8f402ac4bae352/7-bank-project%2F1-template-route%2Ftranslations%2FREADME.ko.md?citationMarker=43dcd9a7-70db-4a1f-b0ae-981daa162054 "1")
