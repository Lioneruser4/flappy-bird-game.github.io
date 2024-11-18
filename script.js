// Kullanıcı ve Admin Verilerini Yönetmek için
let users = JSON.parse(localStorage.getItem('users')) || {};
let currentUser = null;

// Modalları Aç/Kapat
function showModal(id) {
  document.getElementById(id).style.display = 'flex';
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

// Kullanıcıyı Giriş Yaptır
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  if (username === 'admin' && password === 'admin') {
    showAdminPanel();
    closeModal('loginModal');
    return;
  }

  if (users[username] && users[username].password === password) {
    currentUser = { username, ...users[username] };
    updateUserInfo();
    closeModal('loginModal');
  } else {
    alert('Kullanıcı adı veya şifre yanlış!');
  }
});

// Kullanıcıyı Kaydet
document.getElementById('registerForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('registerUsername').value;
  const password = document.getElementById('registerPassword').value;

  if (users[username]) {
    alert('Bu kullanıcı adı zaten kullanılıyor!');
  } else {
    users[username] = { password, balance: 20, freeSpins: 20 };
    localStorage.setItem('users', JSON.stringify(users));
    alert('Kayıt başarılı! Giriş yapabilirsiniz.');
    closeModal('registerModal');
  }
});

// Demo Kullanıcı Girişi
function startDemo() {
  currentUser = { username: `Demo_${Math.floor(Math.random() * 1000)}`, balance: 0, freeSpins: 0 };
  updateUserInfo();
}

// Kullanıcı Bilgilerini Güncelle
function updateUserInfo() {
  if (currentUser) {
    document.getElementById('userInfo').style.display = 'block';
    document.getElementById('usernameDisplay').innerText = currentUser.username;
    document.getElementById('userBalance').innerText = currentUser.balance;
    document.getElementById('userFreeSpins').innerText = currentUser.freeSpins;
  } else {
    document.getElementById('userInfo').style.display = 'none';
  }
}

// Slot Makinesi Çalıştır
function spinReels() {
  if (!currentUser) {
    alert('Spin yapmak için giriş yapmalısınız!');
    return;
  }

  if (currentUser.balance <= 0 && currentUser.freeSpins <= 0) {
    alert('Bakiyeniz veya ücretsiz spin hakkınız yok!');
    return;
  }

  // Spin işlemi başlatmadan önce ses efektini çal
  const spinSound = new Audio('assets/spin.mp3');
  spinSound.play();

  if (currentUser.freeSpins > 0) {
    currentUser.freeSpins--;
  } else {
    currentUser.balance--;
  }

  document.getElementById('userBalance').innerText = currentUser.balance;
  document.getElementById('userFreeSpins').innerText = currentUser.freeSpins;

  // Çark Dönüşü
  const symbols = ['🍒', '🔔', '💎', '🍋', '🍉', '⭐', '🎰'];
  const reel1 = symbols[Math.floor(Math.random() * symbols.length)];
  const reel2 = symbols[Math.floor(Math.random() * symbols.length)];
  const reel3 = symbols[Math.floor(Math.random() * symbols.length)];

  document.getElementById('reel1').innerText = reel1;
  document.getElementById('reel2').innerText = reel2;
  document.getElementById('reel3').innerText = reel3;

  // Kazanma Kontrolü
  if (reel1 === reel2 && reel2 === reel3) {
    alert('Tebrikler! Kazandınız!');
    
    // Kazanma sesini çal
    const winSound = new Audio('assets/win.mp3');
    winSound.play();

    // Bonus Kazanımı
    if (reel1 === '⭐') {
      alert('Bonus! 10 Ücretsiz Spin Kazandınız!');
      currentUser.freeSpins += 10;
    } else {
      currentUser.balance += 10; // Kazanç
    }
    document.getElementById('userBalance').innerText = currentUser.balance;
  }

  // Güncel Bilgileri Kaydet
  if (currentUser.username.startsWith('Demo_')) return;
  users[currentUser.username] = { ...currentUser };
  localStorage.setItem('users', JSON.stringify(users));
}

// Admin Panelini Göster
function showAdminPanel() {
  const userListDiv = document.getElementById('userList');
  userListDiv.innerHTML = '<h3>Kullanıcı Listesi</h3>';

  for (const [username, data] of Object.entries(users)) {
    const userDiv = document.createElement('div');
    userDiv.innerHTML = `
      <strong>${username}</strong> - Bakiye: ${data.balance} - Ücretsiz Spin: ${data.freeSpins}
      <button onclick="addBalance('${username}')">Bakiye Ekle</button>
    `;
    userListDiv.appendChild(userDiv);
  }

  document.getElementById('adminPanel').style.display = 'flex';
}

// Bakiye Ekle
function addBalance(username) {
  const amount = prompt('Eklemek istediğiniz bakiye miktarını girin:');
  if (amount && !isNaN(amount)) {
    users[username].balance += parseInt(amount, 10);
    localStorage.setItem('users', JSON.stringify(users));
    showAdminPanel();
    alert('Bakiye başarıyla eklendi!');
  }
}
