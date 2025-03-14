const { Telegraf, Markup } = require('telegraf');
const axios = require("axios");
const ytdl = require("@distube/ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs-extra");
const path = require("path");
const crypto = require("crypto");

const { ADMIN_ID, token } = require("./config");

// Bot Token
// const token = "5741055163:AAHjaluUJsYOKy7sDdMlVnGabFFMtBAF_UQ";
const bot = new Telegraf(token);

// Önce tüm dosya yollarını tanımlayalım
const musicFolder = path.join(__dirname, "songs");
const statsFilePath = path.join(__dirname, "stats.json");
const groupsFilePath = path.join(__dirname, "groups.json");
const usersFilePath = path.join(__dirname, "users.json");
const statsPath = path.join(__dirname, "stats.json");
const favoritesFile = path.join(__dirname, "favori.json");
const songStatsPath = path.join(__dirname, "song_stats.json");
const groupLangFile = path.join(__dirname, 'group_lang.json');

// FFmpeg ayarları
const ffmpegStatic = require("ffmpeg-static");
ffmpeg.setFfmpegPath(ffmpegStatic);

// Sonra JSON dosyalarını kontrol eden fonksiyonu tanımlayalım
function initializeJsonFiles() {
    const files = {
        [statsFilePath]: {},
        [groupsFilePath]: {},
        [favoritesFile]: {},
        [songStatsPath]: {},
        [groupLangFile]: {}
    };

    for (const [filePath, defaultContent] of Object.entries(files)) {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(defaultContent, null, 2));
        }
    }
}

// Ve en son çağıralım
initializeJsonFiles();

// Dil dosyalarını yükleyin (bu kısmı değiştirin)
const languages = {
    az: require('./language/az.json'),
    tr: require('./language/tr.json')
};
  
// Favorileri kaydetme fonksiyonu
function saveFavorites(favorites) {
    fs.writeFileSync(favoritesFile, JSON.stringify(favorites, null, 2));
}

  // Kullanıcı dil tercihlerinin saklanacağı JSON dosyası
  let groupLang = {};
  
  // Eğer dosya varsa oku, yoksa boş bir obje başlat
  if (fs.existsSync(groupLangFile)) {
    groupLang = JSON.parse(fs.readFileSync(groupLangFile));
  }
  
  // Grubun dilini alın
  const getGroupLang = (chatId) => {
    return groupLang[chatId] || 'az';
  };
  
  // Grubun dilini ayarlayın
  const setGroupLang = (chatId, lang) => {
    groupLang[chatId] = lang;
    fs.writeFileSync(groupLangFile, JSON.stringify(groupLang, null, 2));
  };

// Kullanıcı istatistiklerini yükle
async function loadStats() {
    if (!fs.existsSync(statsPath)) {
        await fs.writeJSON(statsPath, {});
    }
    return await fs.readJSON(statsPath);
}

// Kullanıcı istatistiklerini güncelle
async function updateStats(userId, username) {
    try {
        let stats = {};
        if (fs.existsSync(statsFilePath)) {
            stats = JSON.parse(fs.readFileSync(statsFilePath, "utf8"));
        }

        if (!stats[userId]) {
            stats[userId] = { username, count: 0 };
        }
        stats[userId].count += 1;

        // Boş obje ile başlat
        fs.writeFileSync(statsFilePath, JSON.stringify(stats, null, 2));
    } catch (error) {
        console.error("İstatistik güncellenirken hata:", error);
    }
}

// Şarkı istatistiklerini yükle
async function loadSongStats() {
    if (!fs.existsSync(songStatsPath)) {
        await fs.writeJSON(songStatsPath, {});
    }
    return await fs.readJSON(songStatsPath);
}

// Şarkı istatistiklerini güncelle
async function updateSongStats(title, artist = "Songazbot") {
    let stats = {};
    try {
        if (fs.existsSync(songStatsPath)) {
            stats = JSON.parse(fs.readFileSync(songStatsPath, "utf8"));
        }

        const songKey = `${title} - ${artist}`;
        if (!stats[songKey]) {
            stats[songKey] = {
                title: title,
                artist: artist,
                downloads: 0,
                lastDownload: null
            };
        }

        stats[songKey].downloads += 1;
        stats[songKey].lastDownload = new Date().toISOString();

        fs.writeFileSync(songStatsPath, JSON.stringify(stats, null, 2));
    } catch (error) {
        console.error("Şarkı istatistikleri güncellenirken hata:", error);
    }
}

// Callback data için başlığı kısaltma fonksiyonu
function shortenTitle(title) {
    // Başlığı 32 karakterle sınırla (Telegram sınırı 64, ama prefix ve suffix için yer bırakalım)
    if (title.length > 32) {
        return title.substring(0, 29) + '...';
    }
    return title;
}

// `start` komutu - Bot özelde çalışacak
bot.command("start", (ctx) => {
    const chatId = ctx.chat.id;
    const userId = ctx.from.id;
    const lang = getGroupLang(chatId);
    if (ctx.chat.type === "private") {
        ctx.replyWithHTML(languages[lang].start.msg.replace("{}", ctx.from.first_name),{
            reply_markup:{
                inline_keyboard:[
                    [{
                        text:`${languages[lang].start.addButton}`,
                        url: 'https://t.me/songazbot?startgroup='
                    }]
                ]
            }
        });
    }
});

// Kullanıcının favori şarkılarını getir
bot.command("my", async (ctx) => {
    const userId = ctx.from.id.toString();
    const chatId = ctx.chat.id;
    const lang = getGroupLang(chatId);

    if (!fs.existsSync(favoritesFile)) return ctx.reply(languages[lang].my.notFav);
    
    let favorites = JSON.parse(fs.readFileSync(favoritesFile, "utf-8"));
    if (!favorites[userId] || favorites[userId].length === 0) {
        return ctx.reply(languages[lang].my.notFav);
    }
    
    sendFavorites(ctx, userId, 1);
});


// /lang komutu (sadece gruplarda)
bot.command('lang', async (ctx) => {
    const chatId = ctx.chat.id;
    const lang = getGroupLang(chatId);

        // Komutun yalnızca grup sohbetlerinde çalıştığını kontrol et
    if (ctx.message.chat.type === 'private') {
        return ctx.reply(languages[lang].is.group);
    }

    // Eğer özel mesajdaysa komutu çalıştırma
    if (ctx.chat.type === 'private') {
      return ctx.reply(languages[lang].is.admin);
    }
  
    // Yöneticileri kontrol et
    const admins = await ctx.telegram.getChatAdministrators(chatId);
    const userId = ctx.from.id;
    const isAdmin = admins.some(admin => admin.user.id === userId);
  
    if (!isAdmin) {
      return ctx.reply(languages[lang].is.admin);
    }
    
  
    // Dil değiştirme seçeneklerini gönder
    ctx.reply(languages[lang].is.info, Markup.inlineKeyboard([
      [
        Markup.button.callback('🇦🇿 Azərbaycan', 'set_lang_az'),
        Markup.button.callback('🇹🇷 Türkçe', 'set_lang_tr')
    //   ], [
    //     Markup.button.callback('🇺🇸 English', 'set_lang_en'),
    //     Markup.button.callback('🇷🇺 Русский', 'set_lang_ru')
      ]
    ]));
  });

// `stat` komutu - Sadece admin kullanabilir
bot.command("stat", async (ctx) => {
    const chatId = ctx.chat.id;
    const lang = getGroupLang(chatId);

    if (ctx.from.id !== ADMIN_ID) {
        return ctx.reply(languages[lang].is.admin);
    }

    // Kullanıcı istatistiklerini al
    const stats = JSON.parse(fs.readFileSync(statsFilePath, "utf8"));
    const users = Object.keys(stats).length;

    // Grup sayısını almak için `groups.json` dosyasını oku
    let groups = {};
    if (fs.existsSync(groupsFilePath)) {
        groups = JSON.parse(fs.readFileSync(groupsFilePath, "utf8"));
    }

    const groupCount = Object.keys(groups).length; // grup ID'lerini say

    // const message = `📊 *Bot Kullanıcı ve Grup İstatistikleri:*\n\n` +
    //                 `👥 Toplam Kullanıcı Sayısı: ${users}\n` +
    //                 `📚 Toplam Grup Sayısı: ${groupCount}`;
    
    ctx.reply(languages[lang].stat.msg
        .replace("{}", users)
        .replace("{}", groupCount),
        
        { parse_mode: "HTML" });
});


bot.command("song", async (ctx) => {
    const chatId = ctx.chat.id;
    const lang = getGroupLang(chatId);

    if (ctx.chat.type !== "group" && ctx.chat.type !== "supergroup") {
        return ctx.replyWithHTML(languages[lang].is.group);
    }

    const query = ctx.message.text.split(" ").slice(1).join(" ");
    if (!query) return ctx.replyWithHTML(languages[lang].song.err);

    const userId = ctx.from.id;
    const username = ctx.from.username || `${ctx.from.first_name} ${ctx.from.last_name || ""}`;

    const sentMessage = await ctx.replyWithHTML(languages[lang].song.search.replace("{}", query));

    try {
        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        const searchResponse = await axios.get(searchUrl);
        const videoIdMatch = searchResponse.data.match(/"videoId":"(.*?)"/);
        if (!videoIdMatch) return ctx.replyWithHTML(languages[lang].song.notSong);

        const videoId = videoIdMatch[1];
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        const videoInfo = await ytdl.getInfo(videoUrl);
        const title = videoInfo.videoDetails.title.replace(/[<>:"/\\|?*]+/g, "");
        const outputFilePath = path.join(musicFolder, `${title}.mp3`);

        await fs.ensureDir(musicFolder);

        if (sentMessage && sentMessage.message_id) {
            try {
                await ctx.deleteMessage(sentMessage.message_id); // Mesajı silmeyi dene
            } catch (error) {
                console.error("Mesaj silinemedi:", error.description);
            }
        }
        

        if (fs.existsSync(outputFilePath)) {
            await updateStats(userId, username);
            await updateSongStats(title);
            return ctx.sendChatAction("upload_audio").then(() => {
                return ctx.replyWithAudio(
                    { source: outputFilePath },
                    {
                        title: title,
                        performer: "Songazbot",
                        caption: `🎵 <b>${title}</b>`,
                        parse_mode: "HTML"
                    }
                );
            });
        }

        const stream = ytdl(videoUrl, {
            filter: "audioonly",
            quality: "highestaudio",
        });

        ffmpeg(stream)
            .audioCodec("libmp3lame")
            .toFormat("mp3")
            .save(outputFilePath)
            .on("end", async () => {
                await updateStats(userId, username);
                await updateSongStats(title);

                const groupId = ctx.chat.id;
                let groups = {};
                if (fs.existsSync(groupsFilePath)) {
                    groups = JSON.parse(fs.readFileSync(groupsFilePath, "utf8"));
                }

                if (!groups[groupId]) {
                    groups[groupId] = [];
                }

                groups[groupId].push(title);
                fs.writeFileSync(groupsFilePath, JSON.stringify(groups, null, 2));

                if (sentMessage && sentMessage.message_id) {
                    try {
                        await ctx.deleteMessage(sentMessage.message_id); // Mesajı silmeyi dene
                    } catch (error) {
                        console.error("Mesaj silinemedi:", error.description);
                    }
                }
                

                ctx.sendChatAction("upload_audio").then(() => {
                    return ctx.replyWithAudio(
                        { source: outputFilePath },
                        {
                            title: title,
                            performer: "Songazbot",
                            caption: `🎵 <b>${title}</b>`,
                            parse_mode: "HTML"
                        }
                    );
                });
            })
            .on("error", (err) => {
                console.error("FFmpeg hatası:", err);
                ctx.replyWithHTML(languages[lang].song.sErr);
            });
    } catch (error) {
        console.error(error);
        ctx.reply(languages[lang].song.err1);
    }
});



// `/msg` komutu - Admin tarafından kullanılabilir
bot.command("msg", async (ctx) => {
    const chatId = ctx.chat.id;
    const lang = getGroupLang(chatId);

    if (ctx.from.id !== ADMIN_ID) {
        return ctx.replyWithHTML(languages[lang].is.admin);
    }

    const args = ctx.message.text.split("\n").slice(1); // İlk satır (/msg) hariç tümünü al
    if (args.length === 0) return ctx.reply("❌ Yayınlayacağınız mesajı yazın");

    let message = args[0]; // İlk satır mesaj
    let buttonText, buttonUrl;

    // Eğer ikinci satır varsa ve "-" içeriyorsa buton olarak algıla
    if (args[1] && args[1].includes(" - ")) {
        const buttonParts = args[1].split(" - ");
        if (buttonParts.length === 2) {
            buttonText = buttonParts[0].trim();
            buttonUrl = buttonParts[1].trim();
        }
    }

    // Eğer buton varsa inline keyboard ekle
    const keyboard = buttonText && buttonUrl ? {
        reply_markup: {
            inline_keyboard: [[{ text: buttonText, url: buttonUrl }]]
        }
    } : {}; 

    let userCount = 0, groupCount = 0, errorCount = 0;

    try {
        // Kullanıcılara mesaj gönderme (stats.json baz alınarak)
        const stats = JSON.parse(fs.readFileSync(statsPath, "utf8"));
        for (const userId in stats) {
            try {
                await bot.telegram.sendMessage(userId, message, keyboard);
                console.log(`İstifadəçi ${userId} mesaj aldı.`);
                userCount++;
            } catch (error) {
                if (error.response && error.response.error_code === 403) {
                    console.log(`⚠ istifadəçi ${userId} mesaj alamır (botu başlatmayıb).`);
                } else {
                    console.error(`istifadəçi ${userId} mesaj alırken xəta oldu:`, error);
                    errorCount++;
                }
            }
        }
    } catch (error) {
        console.error("istifadəçiyə mesaj göndrərkən xəta baş verdi:", error);
    }

    // Gruplara mesaj gönderme (groups.json kullanarak)
    if (fs.existsSync(groupsFilePath)) {
        try {
            const groups = JSON.parse(fs.readFileSync(groupsFilePath, "utf8"));
            for (const groupId of Object.keys(groups)) {
                await bot.telegram.sendMessage(groupId, message, keyboard);
                console.log(`Grup ${groupId} mesaj aldı.`);
                groupCount++;
            }
        } catch (error) {
            console.error("Gruplara mesaj göndrərkən xəta baş verdi:", error);
        }
    }

    ctx.reply(`✅ Mesaj uğurla göndərildi\n👥 istifadəçi: ${userCount}\n📢 Gruplar: ${groupCount}\n⚠ Xəta: ${errorCount}`);
});




bot.command("stats", async (ctx) => {
    const chatId = ctx.chat.id;
    const lang = getGroupLang(chatId);

    let stats = await loadStats();

    if (Object.keys(stats).length === 0) {
        return ctx.replyWithHTML(languages[lang].stats.notSong);
    }

    let topUsers = Object.entries(stats)
        .sort(([, a], [, b]) => b.count - a.count)
        .slice(0, 15);

    let message = `${languages[lang].stats.users}\n`;
    topUsers.forEach(([_, user], index) => {
        message += `${index + 1}. <b>${user.username}</> - <code>${user.count}</>\n`;
    });

    ctx.replyWithHTML(message);
});


// Dil değiştirme butonları
bot.action('set_lang_az', (ctx) => {
    const chatId = ctx.chat.id;
    const userId = ctx.from.id;
    const lang = getGroupLang(chatId);

    // Yöneticileri kontrol et
    ctx.telegram.getChatAdministrators(chatId).then(admins => {
      const isAdmin = admins.some(admin => admin.user.id === userId);
      if (!isAdmin) return ctx.answerCbQuery(languages[lang].is.admin);
  
      setGroupLang(chatId, 'az');
      ctx.editMessageText(`Grup dili Azərbaycan dili olaraq dəyiştirildi.`);
    });
  });

// Dil değiştirme butonları
bot.action('set_lang_tr', (ctx) => {
    const chatId = ctx.chat.id;
    const userId = ctx.from.id;
    const lang = getGroupLang(chatId);

    // Yöneticileri kontrol et
    ctx.telegram.getChatAdministrators(chatId).then(admins => {
      const isAdmin = admins.some(admin => admin.user.id === userId);
      if (!isAdmin) return ctx.answerCbQuery(languages[lang].is.admin);
  
      setGroupLang(chatId, 'tr');
      ctx.editMessageText(`Grup dili Türkçe olarak ayarlandı.`);
    });
  });

  bot.action(/unfav_(.+)/, async (ctx) => {
    const userId = ctx.from.id;
    const songTitle = ctx.match[1];
    const chatId = ctx.chat.id;
    const lang = getGroupLang(chatId);
    if (!fs.existsSync(favoritesFile)) return await ctx.answerCbQuery(languages[lang].my.not);

    let favorites = JSON.parse(fs.readFileSync(favoritesFile));
    if (!favorites[userId] || !favorites[userId].includes(songTitle)) {
        return await ctx.answerCbQuery(languages[lang].my.not);
    }
    favorites[userId] = favorites[userId].filter(song => song !== songTitle);
    saveFavorites(favorites);
    await ctx.answerCbQuery(languages[lang].my.del);
});
  
// Favori butonlarını işleme
bot.action(/fav_(.+)/, async (ctx) => {
    const userId = ctx.from.id;
    const songTitle = ctx.match[1];
    const chatId = ctx.chat.id;
    const lang = getGroupLang(chatId);
    let favorites = {};
    if (fs.existsSync(favoritesFile)) {
        favorites = JSON.parse(fs.readFileSync(favoritesFile));
    }
    if (!favorites[userId]) favorites[userId] = [];

    if (!favorites[userId].includes(songTitle)) {
        favorites[userId].push(songTitle);
        saveFavorites(favorites);
        await ctx.answerCbQuery(languages[lang].my.add);
    } else {
        await ctx.answerCbQuery(languages[lang].my.is);
    }
});

//const sentMessage = await ctx.replyWithHTML(languages[lang].song.search.replace("{}", query));





// Kullanıcı adıyla şarkı indirme
bot.on("text", async (ctx) => {
    const chatId = ctx.chat.id;
    const lang = getGroupLang(chatId);

    if (ctx.chat.type === "private" && !ctx.message.text.startsWith("/")) {
        const query = ctx.message.text.trim();
        if (!query) return;

        const userId = ctx.from.id;
        const username = ctx.from.username || `${ctx.from.first_name} ${ctx.from.last_name || ""}`;

        const sentMessage = await ctx.replyWithHTML(languages[lang].song.search.replace("{}", query));

        try {
            const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
            const searchResponse = await axios.get(searchUrl);
            const videoIdMatch = searchResponse.data.match(/"videoId":"(.*?)"/);
            if (!videoIdMatch) return ctx.replyWithHTML(languages[lang].song.notSong);

            const videoId = videoIdMatch[1];
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

            const videoInfo = await ytdl.getInfo(videoUrl);
            const title = videoInfo.videoDetails.title.replace(/[<>:"/\\|?*]+/g, "");
            const outputFilePath = path.join(musicFolder, `${title}.mp3`);

            await fs.ensureDir(musicFolder);
            await ctx.telegram.editMessageText(sentMessage.chat.id, sentMessage.message_id, undefined, `📥 ${title}`);
            
            if (fs.existsSync(outputFilePath)) {
                await updateStats(userId, username);
                await updateSongStats(title);
                return ctx.replyWithAudio(
                    { source: outputFilePath },
                    {
                        title: title,
                        performer: "Songazbot",
                        caption: `🎵 <b>${title}</b>`,
                        parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: "❤️", callback_data: `fav_${shortenTitle(title)}` }, { text: "💔", callback_data: `unfav_${shortenTitle(title)}` }]
                            ]
                        }
                    }
                );
            }

            const stream = ytdl(videoUrl, { filter: "audioonly", quality: "highestaudio" });

            ffmpeg(stream)
                .audioCodec("libmp3lame")
                .toFormat("mp3")
                .save(outputFilePath)
                .on("end", async () => {
                    await updateStats(userId, username);
                    await updateSongStats(title);

                    // Mesaj silme kısmını kaldırdık
                    ctx.replyWithAudio(
                        { source: outputFilePath },
                        {
                            title: title,
                            performer: "Songazbot",
                            caption: `🎵 <b>${title}</b>`,
                            parse_mode: "HTML",
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: "❤️", callback_data: `fav_${shortenTitle(title)}` }, { text: "💔", callback_data: `unfav_${shortenTitle(title)}` }]
                                ]
                            }
                        }
                    );
                })
                .on("error", (err) => {
                    console.error("FFmpeg hatası:", err);
                    ctx.replyWithHTML(languages[lang].song.sErr);
                });

        } catch (error) {
            console.error(error);
            ctx.reply(languages[lang].song.err1);
        }
    }
});





// Başlangıç yapılandırmasını çalıştır ve botu başlat
(async () => {
    try {
        // Başlangıç yapılandırması
        await initialize();
        
        // Web sunucusunu başlat
        app.listen(PORT, HOST, () => {
            console.log(`Web sunucusu http://${HOST}:${PORT} adresinde çalışıyor`);
        });

        // Botu başlat
        await bot.launch({
            dropPendingUpdates: true // Eski mesajları temizle
        });
        console.log('Bot başarıyla başlatıldı!');

    } catch (error) {
        console.error('Başlatma hatası:', error);
        process.exit(1);
    }
})();

// Güvenli kapatma
process.once('SIGINT', () => {
    bot.stop('SIGINT');
    process.exit();
});
process.once('SIGTERM', () => {
    bot.stop('SIGTERM');
    process.exit();
});

// Favori şarkıları sayfalı olarak gönder
function sendFavorites(ctx, userId, page) {
    const favorites = JSON.parse(fs.readFileSync(favoritesFile, "utf-8"));
    const userFavorites = favorites[userId] || [];
    const pageSize = 5; // Her sayfada 5 şarkı gösterilecek
    const totalPages = Math.max(1, Math.ceil(userFavorites.length / pageSize)); // En az 1 sayfa olsun
    const groupId = ctx.chat.id;
    const lang = getGroupLang(groupId);

    let start = (page - 1) * pageSize;
    let end = Math.min(start + pageSize, userFavorites.length);
    let songs = userFavorites.slice(start, end);
    
    let text = "\n";
    let buttons = [];
    
    songs.forEach((song, index) => {
        let songIndex = start + index;
        text += `<b>${songIndex + 1}.</> <code>${song}</>\n`;
        buttons.push([{ text: (songIndex + 1).toString(), callback_data: `fav_${songIndex}` }]);
    });

    let navButtons = [];
    if (page > 1) navButtons.push({ text: "⬅ Geri", callback_data: `fav_page_${page - 1}` });
    if (page < totalPages) navButtons.push({ text: "İleri ➡", callback_data: `fav_page_${page + 1}` });
    
    if (navButtons.length > 0) buttons.push(navButtons);
    
    ctx.reply(languages[lang].my.msg.replace("{}", text), {
        parse_mode: "HTML"
    });
}


// Başlangıç yapılandırması
async function initialize() {
    try {
        await initializeFolders();
        initializeJsonFiles();
        createDefaultLanguageFiles();
    } catch (error) {
        console.error('Başlangıç yapılandırması sırasında hata:', error);
    }
}

// Klasörleri oluştur
async function initializeFolders() {
    const folders = ['songs', 'language'];
    for (const folder of folders) {
        const folderPath = path.join(__dirname, folder);
        if (!fs.existsSync(folderPath)) {
            await fs.mkdir(folderPath);
        }
    }
}

// Varsayılan dil dosyalarını oluştur
function createDefaultLanguageFiles() {
    const defaultLanguages = {
        'az.json': {
            "start": {
                "msg": "Salam {}! Mən musiqi yükləmək üçün botam.",
                "addButton": "➕ Qrupa əlavə et"
            },
            // Diğer Azerice çeviriler...
        },
        'tr.json': {
            "start": {
                "msg": "Merhaba {}! Ben müzik indirmek için bir botum.",
                "addButton": "➕ Gruba ekle"
            },
            // Diğer Türkçe çeviriler...
        }
    };

    for (const [fileName, content] of Object.entries(defaultLanguages)) {
        const filePath = path.join(__dirname, 'language', fileName);
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
        }
    }
}

// Tam başlığı bulma fonksiyonu
function findFullTitle(shortTitle) {
    // Eğer kısaltılmış başlık ... ile bitiyorsa
    if (shortTitle.endsWith('...')) {
        const prefix = shortTitle.slice(0, -3); // ... kısmını kaldır
        // song_stats.json'dan tam başlığı bul
        const stats = JSON.parse(fs.readFileSync(songStatsPath, 'utf8'));
        const fullTitle = Object.keys(stats).find(title => 
            title.startsWith(prefix)
        );
        return fullTitle || shortTitle;
    }
    return shortTitle;
}

// Web sunucusu için gerekli modülleri ekleyelim
const express = require('express');
const app = express();

// CORS ayarları
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Statik dosyalar için klasör ayarları
app.use(express.static(path.join(__dirname, 'public')));
app.use('/songs', express.static('songs'));

// EJS template engine
app.set('view engine', 'ejs');

// Ana sayfa
app.get('/', (req, res) => {
    const songsDir = path.join(__dirname, 'songs');
    let songs = [];
    
    // Şarkı istatistiklerini oku
    let songStats = {};
    try {
        if (fs.existsSync(songStatsPath)) {
            songStats = JSON.parse(fs.readFileSync(songStatsPath, "utf8"));
        }
    } catch (error) {
        console.error("Şarkı istatistikleri okunamadı:", error);
    }

    // songs klasöründeki MP3'leri oku
    fs.readdirSync(songsDir).forEach(file => {
        if (path.extname(file) === '.mp3') {
            const songName = file.replace('.mp3', '');
            const songKey = `${songName} - Songazbot`;
            const downloads = songStats[songKey]?.downloads || 0;
            
            songs.push({
                name: songName,
                file: file,
                downloads: downloads
            });
        }
    });

    // Şarkıları indirme sayısına göre sırala
    songs.sort((a, b) => b.downloads - a.downloads);

    res.render('index', { 
        songs: songs, 
        query: ''
    });
});

// Port ve host ayarları
const PORT = process.env.PORT || 3000;
const HOST = '193.35.154.81';

