const express = require("express");
const axios = require("axios");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
app.use(express.json());

const TELEGRAM_BOT_TOKEN = "YOUR_TELEGRAM_BOT_TOKEN";
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

// YouTube'dan müzik indir
app.post("/download", async (req, res) => {
    const { youtubeUrl } = req.body;

    try {
        // YouTube'dan sesi indir
        const audioPath = await downloadAudio(youtubeUrl);

        // Telegram'a gönder
        await sendAudioToTelegram(audioPath);

        // Dosyayı sil
        fs.unlinkSync(audioPath);

        res.json({ success: true, message: "Müzik başarıyla indirildi ve gönderildi." });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

// YouTube'dan ses indirme
async function downloadAudio(url) {
    return new Promise((resolve, reject) => {
        const outputPath = `audio_${Date.now()}.mp3`;
        ffmpeg(url)
            .audioBitrate(128)
            .save(outputPath)
            .on("end", () => resolve(outputPath))
            .on("error", (err) => reject(err));
    });
}

// Telegram'a ses gönderme
async function sendAudioToTelegram(audioPath) {
    const chatId = "USER_CHAT_ID"; // Kullanıcının chat ID'si
    const audio = fs.createReadStream(audioPath);
    await bot.sendAudio(chatId, audio);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
