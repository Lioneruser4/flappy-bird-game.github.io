const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;

let users = {}; // Kullanıcı veritabanı
let coupons = {}; // Kupon kodları

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Kayıt olma endpoint'i
app.post('/register', (req, res) => {
  const { username, password, balance } = req.body;
  if (users[username]) {
    return res.status(400).send('Kullanıcı zaten var.');
  }
  users[username] = { password: password, balance: parseFloat(balance) };
  res.send('Kayıt başarılı!');
});

// Giriş yapma endpoint'i
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (user && user.password === password) {
    req.session.user = user;
    res.send('Giriş başarılı!');
  } else {
    res.status(400).send('Geçersiz kullanıcı adı veya şifre.');
  }
});

// Bakiye görüntüleme endpoint'i
app.get('/balance', (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Önce giriş yapmanız gerekiyor.');
  }
  res.send({ balance: req.session.user.balance });
});

// Kupon oluşturma endpoint'i
app.post('/generate-coupon', (req, res) => {
  const amount = parseFloat(req.body.amount);
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).send('Geçersiz kupon miktarı.');
  }
  const couponCode = Math.random().toString(36).substring(2, 15);
  coupons[couponCode] = amount;
  res.send({ couponCode: couponCode });
});

// Kupon kullanma endpoint'i
app.post('/apply-coupon', (req, res) => {
  const { couponCode } = req.body;
  const amount = coupons[couponCode];
  if (!amount) {
    return res.status(400).send('Geçersiz veya süresi dolmuş kupon kodu.');
  }
  req.session.user.balance += amount;
  delete coupons[couponCode];
  res.send({ balance: req.session.user.balance });
});

// Kullanıcıları ve bakiyeleri görüntüleme (admin paneli) endpoint'i
app.get('/admin/users', (req, res) => {
  if (!req.session.user || req.session.user.username !== 'admin') {
    return res.status(403).send('Yetkiniz yok.');
  }
  res.send(users);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
