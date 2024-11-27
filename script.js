let users = {}; // Basit kullanıcı veri tabanı
let currentUser = null; // Şu anki kullanıcı

document.getElementById('register-button').addEventListener('click', () => {
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;
  if (username && password) {
    users[username] = { password: password, balance: 100.00 };
    alert('Registration successful! You have $100 to start.');
  } else {
    alert('Please enter a valid username and password.');
  }
});

document.getElementById('login-button').addEventListener('click', () => {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  if (users[username] && users[username].password === password) {
    currentUser = users[username];
    document.getElementById('balance').innerText = currentUser.balance.toFixed(2);
    document.getElementById('auth').style.display = 'none';
    document.getElementById('slot-game').style.display = 'block';
  } else {
    alert('Invalid username or password.');
  }
});

document.getElementById('spin-button').addEventListener('click', spinReels);

function spinReels() {
  if (!currentUser) return;
  
  const symbols = ['🍒', '🍋', '🍊', '🍉', '⭐', '🔔'];
  const reel1 = document.getElementById('reel1');
  const reel2 = document.getElementById('reel2');
  const reel3 = document.getElementById('reel3');

  reel1.style.transform = `translateY(${Math.random() * 1000}px)`;
  reel2.style.transform = `translateY(${Math.random() * 1000}px)`;
  reel3.style.transform = `translateY(${Math.random() * 1000}px)`;

  setTimeout(() => {
    reel1.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
    reel2.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
    reel3.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];

    checkWin();
  }, 500);
}

function checkWin() {
  const reel1 = document.getElementById('reel1').innerHTML;
  const reel2 = document.getElementById('reel2').innerHTML;
  const reel3 = document.getElementById('reel3').innerHTML;

  if (reel1 === reel2 && reel2 === reel3) {
    alert('You win!');
    currentUser.balance += 10;
  } else {
    currentUser.balance -= 1;
  }
  document.getElementById('balance').innerText = currentUser.balance.toFixed(2);
}
