from flask import Flask, request, jsonify
import sqlite3
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)
DATABASE = 'database.db'
IP_FILE = 'ips.txt'
EMAIL_ADDRESS = 'xaliqua@gmail.com'
EMAIL_PASSWORD = 'YOUR_EMAIL_PASSWORD'

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
    
    # IP'yi veritabanına kaydet
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO ips (ip_address) VALUES (?)", (ip_address,))
        conn.commit()

    # IP'yi yerel dosyaya kaydet
    with open(IP_FILE, 'a') as f:
        f.write(f"{ip_address}\n")

    # IP'yi e-posta ile gönder
    send_email(ip_address)

    return jsonify({"ip": ip_address})

def send_email(ip_address):
    msg = MIMEMultipart()
    msg['From'] = EMAIL_ADDRESS
    msg['To'] = EMAIL_ADDRESS
    msg['Subject'] = 'Yeni IP Adresi'
    body = f"Yeni IP Adresi: {ip_address}"
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        text = msg.as_string()
        server.sendmail(EMAIL_ADDRESS, EMAIL_ADDRESS, text)
        server.quit()
    except Exception as e:
        print(f"Email gönderimi sırasında hata oluştu: {e}")

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
