 const express = require("express");
const cors = require("cors");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath('/app/bin/ffmpeg');
const TelegramBot = require("node-telegram-bot-api");

const app = express();

// CORS ayarları
app.use(cors());

app.use(express.json());

// Telegram bot token'ı
const TELEGRAM_BOT_TOKEN = "5741055163:AAHjaluUJsYOKy7sDdMlVnGabFFMtBAF_UQ";
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// Web app URL'si
const WEB_APP_URL = "https://lioneruser4.github.io/flappy-bird-game.github.io";

// /download endpoint'i
app.post("/download", async (req, res) => {
    const { youtubeUrl, chatId } = req.body;
    console.log("Download isteği alındı:", { youtubeUrl, chatId });

    if (!youtubeUrl || !chatId) {
        console.error("Eksik parametreler:", { youtubeUrl, chatId });
        return res.status(400).json({ 
            success: false, 
            message: "YouTube URL ve chat ID gereklidir." 
        });
    }

    try {
        console.log("Müzik indiriliyor...");
        const audioPath = await downloadAudio(youtubeUrl);
        console.log("Müzik indirildi:", audioPath);

        console.log("Telegram'a gönderiliyor...");
        await bot.sendAudio(chatId, fs.createReadStream(audioPath));
        console.log("Telegram'a gönderildi");

        fs.unlinkSync(audioPath);
        console.log("Geçici dosya silindi");

        res.json({ 
            success: true, 
            message: "Müzik başarıyla indirildi ve gönderildi." 
        });
    } catch (error) {
        console.error("Hata oluştu:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
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

// YouTube'da müzik arama
async function searchYouTube(query) {
    // Burada YouTube API veya başka bir müzik arama servisi kullanılabilir
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

// Telegram botu dinleme
bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    console.log("Yeni mesaj alındı:", { chatId, text });

    if (text === "/start") {
        const webAppUrl = `${WEB_APP_URL}?chat_id=${chatId}`;
        console.log("Web app URL oluşturuldu:", webAppUrl);

        bot.sendMessage(chatId, "Müzik indirmek için aşağıdaki butona tıklayın:", {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "🎵 Müzik İndir",
                        web_app: { url: webAppUrl }
                    }]
                ]
            }
        });
        console.log("Buton gönderildi");
    } else if (text.includes("youtube.com") || text.includes("youtu.be")) {
        try {
            console.log("YouTube linki algılandı, indirme başlıyor...");
            const audioPath = await downloadAudio(text);
            console.log("Müzik indirildi:", audioPath);

            await bot.sendAudio(chatId, fs.createReadStream(audioPath));
            console.log("Müzik gönderildi");

            fs.unlinkSync(audioPath);
            console.log("Geçici dosya silindi");
        } catch (error) {
            console.error("Hata oluştu:", error);
            bot.sendMessage(chatId, `Hata oluştu: ${error.message}`);
        }
    } else {
        bot.sendMessage(chatId, "Lütfen /start komutunu kullanın veya geçerli bir YouTube linki gönderin.");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
    console.log(`Web app URL: ${WEB_APP_URL}`);
});
