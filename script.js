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
    spinReel(reel2, result2, 1000);
    spinReel(reel3, result3, 2000);

    // Kazanma kontrolü
    setTimeout(() => {
        checkWin(result1, result2, result3);
        spinButton.disabled = false;
    }, 3000); // Tüm çarkların durma süresi
}

function getRandomFruit() {
    return fruits[Math.floor(Math.random() * fruits.length)];
}

function spinReel(reel, result, delay) {
    setTimeout(() => {
        const fruitsHtml = [];
        for (let i = 0; i < 30; i++) { // Dönerken 30 meyve göstermek için
            fruitsHtml.push(`<div>${getRandomFruit()}</div>`);
        }
        fruitsHtml.push(`<div>${result}</div>`);
        reel.innerHTML = fruitsHtml.join('');
        
        let position = 0; // Başlangıç pozisyonu
        const interval = setInterval(() => {
            position += 10; // Her döngüde 10px yukarı kaydır
            reel.style.transform = `translateY(-${position}px)`;

            if (position >= 300) { // 300px yukarı kaydırıldığında
                clearInterval(interval);
                reel.style.transform = 'translateY(0)';
                reel.innerHTML = `<div>${result}</div>`;
            }
        }, 50); // Her 50ms'de bir döndürme
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
    }
}

// Kazanma olasılığını değiştirme fonksiyonu
function setWinProbability(probability) {
    winProbability = probability;
}

// Bahis seçimi pop-up'ı açma/kapatma fonksiyonları
function toggleBetPopup() {
    betPopup.classList.toggle('hidden');
}

function closeBetPopup() {
    betPopup.classList.add('hidden');
}

function openBonusPopup() {
    bonusPopup.classList.remove('hidden');
}

function closeBonusPopup() {
    bonusPopup.classList.add('hidden');
}
