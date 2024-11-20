const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const betAmountInput = document.getElementById('betAmount');
const resultDiv = document.getElementById('result');
const betPopup = document.getElementById('betPopup');

let betAmount = 0;
let balance = 100; // Kullanıcının başlangıç bakiyesi
let car1 = { x: 50, y: 100, speed: Math.random() * 2 + 1 };
let car2 = { x: 50, y: 200, speed: Math.random() * 2 + 1 };
const finishLine = canvas.width - 100;
let raceActive = false;

// Araba resimleri ve yol resmi
const car1Img = new Image();
const car2Img = new Image();
const roadImg = new Image();
car1Img.src = 'car1.png'; // car1.png resmini ekleyin
car2Img.src = 'car2.png'; // car2.png resmini ekleyin
roadImg.src = 'road.png'; // road.png resmini ekleyin

// Bahis yapma fonksiyonu
function placeBet() {
    betAmount = parseInt(betAmountInput.value);
    if (isNaN(betAmount) || betAmount <= 0) {
        alert('Lütfen geçerli bir bahis miktarı girin!');
        return;
    }
    if (betAmount > balance) {
        alert('Yeterli bakiyeniz yok!');
        return;
    }
    balance -= betAmount;
    resultDiv.innerText = `Yarış başlıyor! Bahis miktarı: $${betAmount}`;
    closeBetPopup();
    startRace();
}

// Yarışı başlatma fonksiyonu
function startRace() {
    car1.x = 50;
    car2.x = 50;
    car1.speed = Math.random() * 2 + 1;
    car2.speed = Math.random() * 2 + 1;
    raceActive = true;
    requestAnimationFrame(updateGame);
}

// Oyunu güncelleme fonksiyonu
function updateGame() {
    if (!raceActive) return;

    // Yol hareketi
    ctx.drawImage(roadImg, 0, 0, canvas.width, canvas.height);

    // Arabaların hareketi
    car1.x += car1.speed;
    car2.x += car2.speed;
    ctx.drawImage(car1Img, car1.x, car1.y, 50, 50);
    ctx.drawImage(car2Img, car2.x, car2.y, 50, 50);

    // Bitirme çizgisine ulaşıp ulaşmadığını kontrol et
    if (car1.x >= finishLine || car2.x >= finishLine) {
        raceActive = false;
        declareWinner();
    } else {
        requestAnimationFrame(updateGame);
    }
}

// Yarışın sonucunu belirleme fonksiyonu
function declareWinner() {
    let winner;
    if (car1.x >= finishLine && car2.x >= finishLine) {
        winner = (car1.x > car2.x) ? 'Araba 1' : 'Araba 2';
    } else if (car1.x >= finishLine) {
        winner = 'Araba 1';
    } else {
        winner = 'Araba 2';
    }

    if (winner === 'Araba 1') {
        balance += betAmount * 3; // Kullanıcı kazandıysa bahis miktarının 3 katı kazansın
    }

    resultDiv.innerText = `${winner} kazandı! Güncel bakiye: $${balance}`;
}

// Pop-up gösterme fonksiyonu
function showBetPopup() {
    betPopup.classList.remove('hidden');
}

// Pop-up kapatma fonksiyonu
function closeBetPopup() {
    betPopup.classList.add('hidden');
}

window.onload = function() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    resultDiv.innerText = `Başlangıç bakiyesi: $${balance}`;
};
