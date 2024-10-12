const gameArea = document.getElementById('game-area');
const scaryVideo = document.getElementById('scary-video');
const closeBtn = document.getElementById('close-btn');

// Rastgele video açan kutu numarası
const luckyBoxIndex = Math.floor(Math.random() * 30);

// Kutulara logo ekleyin (örnek resim URL'lerini burada kullanabilirsiniz)
const logoUrl = "https://via.placeholder.com/50"; // Kutu için kullanacağınız logo URL'si
const emptyText = "Boş!";

// Kutuları oluştur
for (let i = 0; i < 30; i++) {
    const box = document.createElement('div');
    box.classList.add('box');

    // Kutu içine logo resmi ekleyin
    const img = document.createElement('img');
    img.src = logoUrl;
    box.appendChild(img);

    box.addEventListener('click', () => {
        if (i === luckyBoxIndex) {
            // Video açılır
            scaryVideo.style.display = 'block';
            closeBtn.style.display = 'block';
        } else {
            // Boş kutuya tıklanınca "Boş!" yazısı çıkar
            box.innerHTML = emptyText;
            box.style.color = 'white';
            box.style.fontSize = '20px';
            box.style.display = 'flex';
            box.style.justifyContent = 'center';
            box.style.alignItems = 'center';
            box.style.backgroundColor = 'black';
        }
    });

    gameArea.appendChild(box);
}

// Kapat butonu video kapatmak için
closeBtn.addEventListener('click', () => {
    scaryVideo.style.display = 'none';
    closeBtn.style.display = 'none';
});
v
