const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/slots', { useNewUrlParser: true, useUnifiedTopology: true });

const scoreSchema = new mongoose.Schema({
    username: String,
    score: Number
});

const Score = mongoose.model('Score', scoreSchema);

app.post('/scores', async (req, res) => {
    const { username, score } = req.body;
    const newScore = new Score({ username, score });
    await newScore.save();
    res.status(201).send(newScore);
});

app.get('/scores', async (req, res) => {
    const scores = await Score.find().sort({ score: -1 }).limit(10);
    res.send(scores);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
