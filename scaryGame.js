const buttonContainer = document.getElementById('button-container');
const scaryVideo = document.getElementById('scary-video');
const closeBtn = document.getElementById('close-btn');

// Rastgele video açan buton numarası
const luckyButtonIndex = Math.floor(Math.random() * 30);

// Butonları oluştur
for (let i = 0; i < 30; i++) {
    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('button-container');
    const button = document.createElement('button');
    button.innerText = i + 1;

    button.addEventListener('click', () => {
        if (i === luckyButtonIndex) {
            // Video açılır
            scaryVideo.style.display = 'block';
            closeBtn.style.display = 'block';
        } else {
            // Boş butona tıklanırsa bir şey olmaz
            button.innerText = 'Boş!';
            button.disabled = true;
        }
    });

    buttonDiv.appendChild(button);
    buttonContainer.appendChild(buttonDiv);
}

// Kapat butonu video kapatmak için
closeBtn.addEventListener('click', () => {
    scaryVideo.style.display = 'none';
    closeBtn.style.display = 'none';
});
const buttonContainer = document.getElementById('button-container');
const scaryVideo = document.getElementById('scary-video');
const closeBtn = document.getElementById('close-btn');

// Rastgele video açan buton numarası
const luckyButtonIndex = Math.floor(Math.random() * 30);

// Butonları oluştur
for (let i = 0; i < 30; i++) {
    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('button-container');
    const button = document.createElement('button');
    button.innerText = i + 1;

    button.addEventListener('click', () => {
        if (i === luckyButtonIndex) {
            // Video açılır
            scaryVideo.style.display = 'block';
            closeBtn.style.display = 'block';
        } else {
            // Boş butona tıklanırsa bir şey olmaz
            button.innerText = 'Boş!';
            button.disabled = true;
        }
    });

    buttonDiv.appendChild(button);
    buttonContainer.appendChild(buttonDiv);
}

// Kapat butonu video kapatmak için
closeBtn.addEventListener('click', () => {
    scaryVideo.style.display = 'none';
    closeBtn.style.display = 'none';
});
