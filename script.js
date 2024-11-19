let balance = 100; // Başlangıç bakiyesi
const messages = document.getElementById('messages');
const chatInput = document.getElementById('chatInput');
const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');
let inolar = [];

// Kullanıcı girişi
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username && password) {
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        if (!localStorage.getItem('balance')) {
            localStorage.setItem('balance', 100); // Her kullanıcı için başlangıç bakiyesi
        }
        balance = parseInt(localStorage.getItem('balance'));
        updateUI();
    }
}

// UI güncellemesi
function updateUI() {
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById('loginContainer').classList.add('hidden');
        document.getElementById('gameContainer').classList.remove('hidden');
        document.getElementById('balanceAmount').innerText = localStorage.getItem('balance');
        initGame();
    } else {
        document.getElementById('loginContainer').classList.remove('hidden');
        document.getElementById('gameContainer').classList.add('hidden');
    }
}

// Mesaj gönderme
function sendMessage() {
    const messageText = chatInput.value;
    if (messageText) {
        const messageElement = document.createElement('div');
        messageElement.innerText = `${localStorage.getItem('username')}: ${messageText}`;
        messages.appendChild(messageElement);
        chatInput.value = '';
    }
}

// Oyun başlangıcı
function initGame() {
    gameCanvas.width = window.innerWidth * 0.8;
    gameCanvas.height = 400;
    addIno();
}

// Ino ekleme
function addIno() {
    const ino = {
        x: Math.random() * gameCanvas.width,
        y: Math.random() * gameCanvas.height,
        size: 20,
        color: 'blue'
    };
    inolar.push(ino);
    drawInolar();
}

// Ino çizimi
function drawInolar() {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    inolar.forEach(ino => {
        ctx.fillStyle = ino.color;
        ctx.fillRect(ino.x, ino.y, ino.size, ino.size);
    });
}

// Bonus uygulama
function applyBonus() {
    const bonusCode = document.getElementById('bonusCode').value;
    if (bonusCode === 'BONUS100') {
        balance += 100;
        localStorage.setItem('balance', balance);
        document.getElementById('balanceAmount').innerText = balance;
        document.getElementById('bonusCode').value = '';
    }
}

// Odalar
function createRoom() {
    const roomId = prompt('Oda ismi girin:');
    if (roomId) {
        const roomElement = document.createElement('div');
        roomElement.innerText = roomId;
        document.getElementById('rooms').appendChild(roomElement);
    }
}

window.onload = function() {
    updateUI();
    setInterval(() => {
        balance += 10;
        localStorage.setItem('balance', balance);
        document.getElementById('balanceAmount').innerText = balance;
    }, 3600000); // Her 1 saatte bir 10$
};
