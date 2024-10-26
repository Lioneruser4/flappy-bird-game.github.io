const fruits = ['🍒', '🍋', '🍊', '🍏', '🍉', '🍇'];
const spinButton = document.getElementById('spin-button');
const resultDiv = document.getElementById('result');

spinButton.addEventListener('click', () => {
    const reel1 = document.getElementById('reel1');
    const reel2 = document.getElementById('reel2');
    const reel3 = document.getElementById('reel3');

    // Döndürme animasyonunu başlat
    reel1.style.transition = 'transform 0.5s ease-in-out';
    reel2.style.transition = 'transform 0.5s ease-in-out';
    reel3.style.transition = 'transform 0.5s ease-in-out';

    // Dönme işlemi için bir döngü oluştur
    const rand1 = Math.floor(Math.random() * fruits.length);
    const rand2 = Math.floor(Math.random() * fruits.length);
    const rand3 = Math.floor(Math.random() * fruits.length);

    // Dönme hareketini uygula
    reel1.style.transform = `translateY(-100px)`;
    reel2.style.transform = `translateY(-100px)`;
    reel3.style.transform = `translateY(-100px)`;

    setTimeout(() => {
        reel1.textContent = fruits[rand1];
        reel2.textContent = fruits[rand2];
        reel3.textContent = fruits[rand3];
        checkResult(fruits[rand1], fruits[rand2], fruits[rand3]);
    }, 500); // Animasyon süresi ile aynı olmalı
});

function checkResult(r1, r2, r3) {
    if (r1 === r2 && r2 === r3) {
        resultDiv.textContent = 'Tebrikler, kazandınız!';
    } else {
        resultDiv.textContent = 'Tekrar deneyin.';
    }
}
