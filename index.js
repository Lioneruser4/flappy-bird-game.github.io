from flask import Flask, request, jsonify
import youtube_dl
import requests
import os

app = Flask(__name__)

# Telegram bot token
TELEGRAM_BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN'
TELEGRAM_API_URL = f'https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendAudio'

# İndirilen müzikleri saklamak için klasör
DOWNLOAD_FOLDER = "downloads"
if not os.path.exists(DOWNLOAD_FOLDER):
    os.makedirs(DOWNLOAD_FOLDER)

@app.route('/download', methods=['POST'])
def download():
    data = request.json
    url = data.get('url')
    chat_id = data.get('chat_id')

    if not url or not chat_id:
        return jsonify({"success": False, "error": "Eksik bilgi!"})

    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'outtmpl': os.path.join(DOWNLOAD_FOLDER, '%(title)s.%(ext)s'),
    }

    try:
        with youtube_dl.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(info)
            mp3_filename = filename.replace('.webm', '.mp3').replace('.m4a', '.mp3')

            # Müziği Telegram botu üzerinden gönder
            with open(mp3_filename, 'rb') as audio_file:
                requests.post(TELEGRAM_API_URL, data={'chat_id': chat_id}, files={'audio': audio_file})

            return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
