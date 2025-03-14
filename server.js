const express = require("express");
const cors = require("cors");
const TelegramBot = require("node-telegram-bot-api");
const ytdl = require("ytdl-core");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");

const app = express();
app.use(cors());
app.use(express.json());

const bot = new TelegramBot("5741055163:AAHjaluUJsYOKy7sDdMlVnGabFFMtBAF_UQ", { polling: true });

// Webview için giriş sayfası
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Müzik indirme fonksiyonu
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Müzik ismi veya YouTube linki gönderin:");
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (ytdl.validateURL(text)) {
    const videoInfo = await ytdl.getInfo(text);
    const title = videoInfo.videoDetails.title;

    bot.sendMessage(chatId, `"${title}" bulundu. İndirmek için butona tıklayın:`, {
      reply_markup: {
        inline_keyboard: [[{ text: "İndir", callback_data: `download_${text}` }]],
      },
    });
  } else {
    bot.sendMessage(chatId, "Geçersiz YouTube linki. Lütfen tekrar deneyin.");
  }
});

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const videoUrl = query.data.split("_")[1];

  const videoInfo = await ytdl.getInfo(videoUrl);
  const title = videoInfo.videoDetails.title;
  const filePath = `${__dirname}/${title}.mp3`;

  ytdl(videoUrl)
    .pipe(fs.createWriteStream(filePath))
    .on("finish", () => {
      bot.sendAudio(chatId, filePath).then(() => fs.unlinkSync(filePath));
    });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running...");
});
