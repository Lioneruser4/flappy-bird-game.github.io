const express = require('express');
const app = express();
const port = 3000;

app.get('/analyze-text', (req, res) => {
    const text = req.query.text;
    const analyzedText = text.toUpperCase();
    res.json({ analyzedText });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${5000}`);
});
