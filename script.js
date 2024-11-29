let users = {}; // Basit kullanıcı veri tabanı
let currentUser = null; // Şu anki kullanıcı
let coupons = {}; // Kupon kodları

document.getElementById('register-button').addEventListener('click', () => {
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;
  const balance = parseFloat(document.getElementById('register-balance').value);
  
  if (username && password && !isNaN(balance)) {
    users[username] = { password: password, balance: balance };
    alert('Registration successful! You can now login.');
  } else {
    alert('Please enter a valid username, password, and balance.');
  }
});

document.getElementById('login-button').addEventListener('click', () => {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  
  if (username === 'admin' && password === 'admin') {
    showAdminPanel();
    return;
  }

  if (users[username] && users[username].password === password) {
    currentUser = users[username];
    document.getElementById('balance').innerText = currentUser.balance.toFixed(2);
    document.getElementById('auth').style.display = 'none';
    document.getElementById('roulette-game').style.display = 'block';
  } else {
    alert('Invalid username or password.');
  }
});

document.getElementById('play-demo-button').addEventListener('click', () => {
  document.getElementById('auth').style.display = 'none';
  document.getElementById('roulette-game').style.display = 'block';
});

document.getElementById('spin-button').addEventListener('click', spinReels);

function spinReels() {
  if (!currentUser) return;
  
  // Rulet oyunu için dönen makaraların kodlarını buraya ekleyin
  
  // Kazanma kontrolü
  checkWin();
}

function checkWin() {
  if (!currentUser) return;
  // Kazanma durumunu kontrol edin ve bakiye güncelleyin
  document.getElementById('balance').innerText = currentUser.balance.toFixed(2);
}

function showAdminPanel() {
  document.getElementById('auth').style.display = 'none';
  document.getElementById('admin-panel').style.display = 'block';
  updateAdminPanel();
}

function updateAdminPanel() {
  const userList = document.getElementById('user-list');
  userList.innerHTML = '<h3>Kullanıcılar ve Bakiye</h3>';
  
  for (const username in users) {
    const user = users[username];
    userList.innerHTML += `<p>${username}: $${user.balance.toFixed(2)}</p>`;
  }
}

document.getElementById('generate-coupon-button').addEventListener('click', () => {
  const amount = parseFloat(document.getElementById('coupon-amount').value);
  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid coupon amount.');
    return;
  }
  const couponCode = Math.random().toString(36).substring(2, 15);
  coupons[couponCode] = amount;
  document.getElementById('coupon-code').innerText = `Coupon Code: ${couponCode}`;
});

document.getElementById('apply-coupon-button').addEventListener('click', () => {
  const couponCode = document.getElementById('coupon-code-input').value;
  if (coupons[couponCode]) {
    currentUser.balance += coupons[couponCode];
    document.getElementById('balance').innerText = currentUser.balance.toFixed(2);
    delete coupons[couponCode];
    alert('Coupon applied successfully!');
  } else {
    alert('Invalid or expired coupon code.');
  }
});
