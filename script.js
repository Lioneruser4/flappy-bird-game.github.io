const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const port = process.env.PORT || 3000;

// İndirme endpoint'i
app.get('/download', async (req, res) => {
    const url = req.query.url;

    if (!ytdl.validateURL(url)) {
        return res.status(400).json({ success: false, message: 'Geçersiz YouTube linki.' });
    }

    try {
        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
        res.json({ success: true, downloadLink: format.url });
    } catch (error) {
        res.status(500).json({ success: false, message: 'İndirme işlemi başarısız oldu.' });
    }
});

// Statik dosyalar (HTML, CSS, JS)
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
