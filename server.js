const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const dataPath = path.join(__dirname, 'data', 'users.json');

// Kullanıcı verilerini yükleme
const loadUserData = () => {
    if (!fs.existsSync(dataPath)) {
        fs.writeFileSync(dataPath, JSON.stringify({}));
    }
    const data = fs.readFileSync(dataPath);
    return JSON.parse(data);
};

// Kullanıcı verilerini kaydetme
const saveUserData = (data) => {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// Kullanıcıyı doğrulama ve veri sağlama
app.post('/auth', (req, res) => {
    const { telegramUserId } = req.body;
    let users = loadUserData();

    if (!users[telegramUserId]) {
        users[telegramUserId] = { score: 0, coins: 0 };
        saveUserData(users);
    }

    res.send(users[telegramUserId]);
});

// Skor güncelleme
app.post('/update-score', (req, res) => {
    const { telegramUserId, score, coins } = req.body;
    let users = loadUserData();

    if (users[telegramUserId]) {
        users[telegramUserId].score = score;
        users[telegramUserId].coins = coins;
        saveUserData(users);
        res.send('User data updated');
    } else {
        res.status(404).send('User not found');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
