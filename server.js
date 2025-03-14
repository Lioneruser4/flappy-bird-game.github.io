 const express = require("express");
const cors = require("cors");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const TelegramBot = require("node-telegram-bot-api");

const app = express();

// CORS ayarları
app.use(cors({
    origin: "https://lioneruser4.github.io", // Frontend'in GitHub Pages URL'si
    methods: ["GET", "POST", "OPTIONS"], // İzin verilen HTTP metodları
    allowedHeaders: ["Content-Type"], // İzin verilen başlıklar
}));

app.use(express.json());

// Telegram bot token'ı (Token'ınızı buraya ekleyin)
const TELEGRAM_BOT_TOKEN = "5741055163:AAHjaluUJsYOKy7sDdMlVnGabFFMtBAF_UQ";
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// /download endpoint'i
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

// YouTube'da müzik arama
async function searchYouTube(query) {
    // Burada YouTube API veya başka bir müzik arama servisi kullanılabilir
    // Örnek bir URL döndürülüyor
    return `https://www.youtube.com/watch?v=dQw4w9WgXcQ`;
}

// Telegram botu dinleme
bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    console.log(`Gelen mesaj: ${text}`); // Gelen mesajı logla

    if (text.startsWith("/start")) {
        // Kullanıcıya webview butonu göster
        bot.sendMessage(chatId, "Müzik indirmek için butona tıklayın:", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Müzik İndir", web_app: { url: `https://lioneruser4.github.io/flappy-bird-game.github.io/?chat_id=${chatId}` } }]
                ]
            }
        });
    } else {
        try {
            let youtubeUrl = null;

            if (text.includes("youtube.com") || text.includes("youtu.be")) {
                youtubeUrl = text;
            } else {
                // Müzik ismi ile arama yap
                youtubeUrl = await searchYouTube(text);
            }

            if (youtubeUrl) {
                // YouTube'dan sesi indir
                const audioPath = await downloadAudio(youtubeUrl);

                // Telegram'a gönder
                await bot.sendAudio(chatId, fs.createReadStream(audioPath));

                // Dosyayı sil
                fs.unlinkSync(audioPath);
            } else {
                bot.sendMessage(chatId, "Müzik bulunamadı.");
            }
        } catch (error) {
            console.error(`Hata oluştu: ${error.message}`);
            bot.sendMessage(chatId, `Hata oluştu: ${error.message}`);
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
