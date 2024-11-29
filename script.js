let users = {}; // Kullanıcı veri tabanı
let currentUser = null; // Şu anki kullanıcı
let coupons = {}; // Kupon kodları

document.getElementById('register-button').addEventListener('click', () => {
    document.getElementById('auth').style.display = 'block';
    document.getElementById('register').style.display = 'block';
});

document.getElementById('register-cancel').addEventListener('click', () => {
    document.getElementById('auth').style.display = 'none';
    document.getElementById('register').style.display = 'none';
});

document.getElementById('login-button').addEventListener('click', () => {
    document.getElementById('auth').style.display = 'block';
    document.getElementById('login').style.display = 'block';
});

document.getElementById('login-cancel').addEventListener('click', () => {
    document.getElementById('auth').style.display = 'none';
    document.getElementById('login').style.display = 'none';
});

document.getElementById('register-submit').addEventListener('click', () => {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const balance = 100; // Yeni kayıt olan kullanıcıya 100$ bakiye veriyoruz
    
    if (username && password) {
        users[username] = { password: password, balance: balance };
        alert('Registration successful! You can now login.');
        document.getElementById('auth').style.display = 'none';
        document.getElementById('register').style.display = 'none';
    } else {
        alert('Please enter a valid username and password.');
    }
});

document.getElementById('login-submit').addEventListener('click', () => {
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
        document.getElementById('login').style.display = 'none';
    } else {
        alert('Invalid username or password.');
    }
});

document.getElementById('spin-button').addEventListener('click', spinReels);

function spinReels() {
    if (!currentUser) {
        alert('Please login to play.');
        return;
    }

    const betAmount = parseFloat(document.getElementById('bet-amount').value);
    if (currentUser.balance < betAmount) {
        alert('Insufficient balance.');
        return;
    }

    const symbols = ['🍒', '🍋', '🍊', '🍉', '⭐', '🔔', '🎁', '🎰'];
    const reel1 = document.getElementById('reel1');
    const reel2 = document.getElementById('reel2');
    const reel3 = document.getElementById('reel3');

    let spin1 = Math.floor(Math.random() * symbols.length);
    let spin2 = Math.floor(Math.random() * symbols.length);
    let spin3 = Math.floor(Math.random() * symbols.length);

    reel1.innerHTML = symbols[spin1];
    reel2.innerHTML = symbols[spin2];
    reel3.innerHTML = symbols[spin3];

    reel1.style.transition = 'transform 3s';
    reel2.style.transition = 'transform 3s';
    reel3.style.transition = 'transform 3s';

    reel1.style.transform = `translateY(${spin1 * 100}%)`;
    reel2.style.transform = `translateY(${spin2 * 100}%)`;
    reel3.style.transform = `translateY(${spin3 * 100}%)`;

    setTimeout(() => {
        const result1 = symbols[spin1];
        const result2 = symbols[spin2];
        const result3 = symbols[spin3];

        checkWin(result1, result2, result3, betAmount);
    }, 3000);
}

function checkWin(result1, result2, result3, betAmount) {
    let winAmount = 0;
    let freeSpins = 0;

    if (result1 === result2 && result2 === result3) {
        if (result1 === '🍒') {
            winAmount = betAmount * 10;
        } else if (result1 === '🎁') {
            freeSpins = 10;
        } else if (result1 === '🎰') {
            winAmount = betAmount * 50;
        }
    }

    currentUser.balance -= betAmount;

    if (winAmount > 0) {
        alert(`You win $${winAmount.toFixed(2)}!`);
        currentUser.balance += winAmount;
        document.getElementById('balance').innerText = currentUser.balance.toFixed(2);
    } else if (freeSpins > 0) {
        alert(`You win ${freeSpins} free spins!`);
    } else {
        alert('No win this time. Try again!');
    }
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
