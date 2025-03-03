const TelegramBot = require('node-telegram-bot-api');
   const token = 'YOUR_TELEGRAM_BOT_TOKEN';
   const bot = new TelegramBot(token, { polling: true });

   bot.onText(/\/start/, (msg) => {
       const chatId = msg.chat.id;
       bot.sendMessage(chatId, "YouTube veya Instagram linki gönderin.");
   });

   bot.on('message', (msg) => {
       const chatId = msg.chat.id;
       const url = msg.text;
       if (ytdl.validateURL(url) || url.includes('instagram.com')) {
           bot.sendMessage(chatId, `İndirme işlemi başlatılıyor...\nhttps://yourgithubio.site/download?url=${encodeURIComponent(url)}`);
       } else {
           bot.sendMessage(chatId, "Geçersiz link. Lütfen YouTube veya Instagram linki gönderin.");
       }
   });
