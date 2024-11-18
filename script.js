let users = {}; // Kullanıcı verileri burada saklanacak
let currentUser = null; // Şu anda giriş yapmış kullanıcı
let isAdmin = false; // Admin kontrolü

// Modal açma ve kapama fonksiyonları
function showModal(id) {
  document.getElementById(id).style.display = 'block';
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

// Giriş yapmak
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  // Admin giriş kontrolü
  if (username === 'admin' && password === 'admin') {
    isAdmin = true;
    showAdminPanel();
    closeModal('loginModal');
    return;
  }

  // Kullanıcı giriş kontrolü
  if (users[username] && users[username].password === password) {
    currentUser = { username, ...users[username] };
    updateUserInfo();
    closeModal('loginModal');
  } else {
    alert('Kullanıcı adı veya şifre yanlış!');
  }
});

// Kayıt olmak
document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('registerUsername').value;
  const password = document.getElementById('registerPassword').value;

  if (users[username]) {
    alert('Bu kullanıcı adı zaten alındı!');
  } else {
    users[username] = { password, balance: 20, freeSpins: 20 };
    alert('Kayıt başarılı!');
    closeModal('registerModal');
  }
});

// Demo oyun başlat
function startDemo() {
  currentUser = { username: 'Demo_' + Math.floor(Math.random() * 1000), balance: 0, freeSpins: 0 };
  updateUserInfo();
  closeModal('loginModal');
}

// Kullanıcı bilgilerini güncelle
function updateUserInfo() {
  if (currentUser) {
    document.getElementById('userBalance').innerText = currentUser.balance;
    document.getElementById('userFreeSpins').innerText = currentUser.freeSpins;
  }
}

// Admin Paneli
function showAdminPanel() {
  if (!isAdmin) return;

  const userListDiv = document.getElementById('userList');
  userListDiv.innerHTML = ''; // Listeyi temizle

  for (const [username, data] of Object.entries(users)) {
    const userDiv = document.createElement('div');
    userDiv.innerHTML = `
      <strong>${username}</strong> - Bakiye: ${data.balance} - Ücretsiz Spin: ${data.freeSpins}
      <button onclick="addBalance('${username}')">Bakiye Ekle</button>
    `;
    userListDiv.appendChild(userDiv);
  }

  showModal('adminPanel');
}

// Kullanıcıya bakiye ekle
function addBalance(username) {
  const amount = prompt('Eklemek istediğiniz bakiye miktarını girin:');
  if (amount && !isNaN(amount)) {
    users[username].balance += parseInt(amount, 10);
    alert('Bakiye başarıyla eklendi!');
    showAdminPanel();
  }
}
