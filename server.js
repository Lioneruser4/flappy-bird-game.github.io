const express = require("express");
const axios = require("axios");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
app.use(express.json());

const TELEGRAM_BOT_TOKEN = "5741055163:AAHjaluUJsYOKy7sDdMlVnGabFFMtBAF_UQ"; // BotFather'dan aldığınız token
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// YouTube'dan müzik indir ve Telegram'a gönder
app.post("/download", async (req, res) => {
    const { youtubeUrl, chatId } = req.body;

    if (!youtubeUrl || !chatId) {
        return res.status(400).json({ success: false, message: "YouTube URL ve chat ID gereklidir." });
    }

    try {
        // YouTube'dan sesi indir
        const audioPath = await downloadAudio(youtubeUrl);

        // Telegram'a gönder
        await bot.sendAudio(chatId, fs.createReadStream(audioPath));

        // Dosyayı sil
        fs.unlinkSync(audioPath);

        res.json({ success: true, message: "Müzik başarıyla indirildi ve gönderildi." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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

// Telegram botu dinleme
bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text.startsWith("/start")) {
        // Kullanıcıya webview butonu göster
        bot.sendMessage(chatId, "Müzik indirmek için butona tıklayın:", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Müzik İndir", web_app: { url: "https://lioneruser4.github.io/flappy-bird-game.github.io/" } }]
                ]
            }
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
