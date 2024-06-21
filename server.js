const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
app.use(bodyParser.json());

const TELEGRAM_BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
const GITHUB_TOKEN = 'YOUR_GITHUB_TOKEN';
const REPO_OWNER = 'YOUR_GITHUB_USERNAME';
const REPO_NAME = 'YOUR_REPO_NAME';

app.post('/auth', async (req, res) => {
    const { telegramUserId } = req.body;
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/users/${telegramUserId}.json`;

    let userData;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`
            }
        });
        userData = Buffer.from(response.data.content, 'base64').toString('utf-8');
    } catch (error) {
        if (error.response.status === 404) {
            userData = JSON.stringify({ score: 0, coins: 0 });
            await axios.put(url, {
                message: `Create user ${telegramUserId}`,
                content: Buffer.from(userData).toString('base64')
            }, {
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`
                }
            });
        } else {
            return res.status(500).send('Error fetching user data');
        }
    }

    res.send(userData);
});

app.post('/update-score', async (req, res) => {
    const { telegramUserId, score, coins } = req.body;
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/users/${telegramUserId}.json`;

    const userData = JSON.stringify({ score, coins });
    try {
        await axios.put(url, {
            message: `Update user ${telegramUserId}`,
            content: Buffer.from(userData).toString('base64')
        }, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`
            }
        });
    } catch (error) {
        return res.status(500).send('Error updating user data');
    }

    res.send('User data updated');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
