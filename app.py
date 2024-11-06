from flask import Flask, request, jsonify
import sqlite3
import requests
import json

app = Flask(__name__)
DATABASE = 'database.db'
GITHUB_API_URL = 'https://api.github.com/repos/YOUR_USERNAME/YOUR_REPOSITORY/contents/ips.txt'
GITHUB_TOKEN = 'YOUR_GITHUB_PERSONAL_ACCESS_TOKEN'

def init_db():
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS ips
                          (id INTEGER PRIMARY KEY, ip_address TEXT)''')
        conn.commit()

@app.route('/')
def home():
    return 'IP adresinizi kaydediyoruz!'

@app.route('/get_ip', methods=['GET'])
def get_ip():
    ip_address = request.remote_addr
    
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO ips (ip_address) VALUES (?)", (ip_address,))
        conn.commit()

    # GitHub'daki dosyaya IP adresini yaz
    write_to_github(ip_address)

    return jsonify({"ip": ip_address})

def write_to_github(ip_address):
    # GitHub API'sini kullanarak dosyaya yeni IP adresini ekle
    headers = {
        'Authorization': f'token {GITHUB_TOKEN}',
        'Accept': 'application/vnd.github.v3+json'
    }

    # Mevcut içeriği oku
    response = requests.get(GITHUB_API_URL, headers=headers)
    if response.status_code == 200:
        content = response.json()
        sha = content['sha']
        existing_data = base64.b64decode(content['content']).decode('utf-8')
    else:
        sha = None
        existing_data = ""

    # Yeni içeriği oluştur
    new_data = existing_data + f"{ip_address}\n"
    encoded_data = base64.b64encode(new_data.encode('utf-8')).decode('utf-8')

    # Dosyayı güncelle
    data = {
        "message": "Add IP address",
        "content": encoded_data
    }
    if sha:
        data['sha'] = sha

    response = requests.put(GITHUB_API_URL, headers=headers, data=json.dumps(data))
    return response.status_code

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
