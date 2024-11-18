// Ses dosyaları
const spinSound = document.getElementById('spinSound');
const winSound = document.getElementById('winSound');

// Kullanıcı ve Bakiye Bilgileri
let users = {}; // Kullanıcılar verisi
let loggedInUser = null;
let userBalance = 1000; // Başlangıç bakiyesi

// Pop-up açma
const loginPopup = document.getElementById('loginPopup');
const loginButton = document.getElementById('loginButton');
const signupButton = document.getElementById('signupButton');
const registerLink = document.getElementById('registerLink');
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

// Slot Oyun Başlatma
const demoButton = document.getElementById('demoButton');
const slotGameContainer = document.getElementById('slotGameContainer');
const spinButton = document.getElementById('spinButton');
const balanceDisplay = document.getElementById('balance');

// Kullanıcı Giriş ve Kayıt
loginButton.addEventListener('click', () => {
  loginPopup.style.display = 'flex';
});

signupButton.addEventListener('click', () => {
  loginForm.reset();
  registerLink.style.display = 'none';
  loginButton.style.display = 'none';
  loginPopup.style.display = 'flex';
});

registerLink.addEventListener('click', () => {
  loginButton.style.display = 'block';
  registerLink.style.display = 'none';
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;

  // Giriş Kontrolü
  if (users[username] && users[username].password === password) {
    loggedInUser = username;
    userBalance = users[username].balance;
    updateBalanceDisplay();
    loginPopup.style.display = 'none';
    slotGameContainer.style.display = 'block';
  } else {
    alert('Hatalı kullanıcı adı veya şifre');
  }
});

// Demo butonuna basıldığında
demoButton.addEventListener('click', () => {
  loggedInUser = 'Demo Kullanıcı';
  userBalance = 1000;
  updateBalanceDisplay();
  slotGameContainer.style.display = 'block';
});

// Slot Oyunu
spinButton.addEventListener('click', () => {
  playSpinSound();
  const slots = document.querySelectorAll('.slot');
  slots.forEach(slot => {
    const randomEmoji = getRandomEmoji();
    slot.textContent = randomEmoji;
    slot.style.animation = 'spinAnimation 1s ease-in-out';
  });

  setTimeout(() => {
    checkWin();
  }, 1000);
});

// Kazanma Kontrolü
function checkWin() {
  const slots = document.querySelectorAll('.slot');
  const emojis = Array.from(slots).map(slot => slot.textContent);
  const allSame = emojis.every(emoji => emoji === emojis[0]);
  
  if (allSame) {
    playWinSound();
    userBalance += 100; // Kazanç ekle
    updateBalanceDisplay();
    alert('Kazandınız!');
  } else {
    alert('Kaybettiniz, tekrar deneyin!');
  }
}

// Bakiye güncellemesi
function updateBalanceDisplay() {
  balanceDisplay.textContent = `Bakiye: ${userBalance}`;
}

// Spin sesi çalma
function playSpinSound() {
  spinSound.play();
}

// Kazanma sesi çalma
function playWinSound() {
  winSound.play();
}

// Rastgele Emoji Üretme
function getRandomEmoji() {
  const emojis = ['🍒', '🍉', '🍋', '🍇', '🍓', '🍊'];
  const randomIndex = Math.floor(Math.random() * emojis.length);
  return emojis[randomIndex];
}
