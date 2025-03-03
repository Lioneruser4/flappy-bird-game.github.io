const express = require('express');
   const ytdl = require('ytdl-core');
   const instagramScraper = require('instagram-scraper');
   const app = express();
   const port = 3000;

   app.get('/download', async (req, res) => {
       const url = req.query.url;
       if (ytdl.validateURL(url)) {
           const info = await ytdl.getInfo(url);
           const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
           res.json({ success: true, downloadLink: format.url });
       } else if (url.includes('instagram.com')) {
           const result = await instagramScraper(url);
           res.json({ success: true, downloadLink: result.videoUrl });
       } else {
           res.json({ success: false });
       }
   });

   app.listen(port, () => {
       console.log(`Server is running on http://localhost:${port}`);
   });
