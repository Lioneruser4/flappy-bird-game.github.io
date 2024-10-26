const fruits = ['🍒', '🍋', '🍊', '🍏', '🍉', '🍇'];
const spinButton = document.getElementById('spin-button');
const resultDiv = document.getElementById('result');

spinButton.addEventListener('click', () => {
    const reel1 = document.getElementById('reel1');
    const reel2 = document.getElementById('reel2');
    const reel3 = document.getElementById('reel3');

    // Meyve simgeleri kutuda dönecek
    const rand1 = Math.floor(Math.random() * fruits.length);
    const rand2 = Math.floor(Math.random() * fruits.length);
    const rand3 = Math.floor(Math.random() * fruits.length);

    // İlk aşama: Simgeyi yukarı doğru kaydır
    reel1.innerHTML = `<div>${fruits[rand1]}</div><div>${fruits[rand1]}</div><div>${fruits[rand1]}</div>`;
    reel2.innerHTML = `<div>${fruits[rand2]}</div><div>${fruits[rand2]}</div><div>${fruits[rand2]}</div>`;
    reel3.innerHTML = `<div>${fruits[rand3]}</div><div>${fruits[rand3]}</div><div>${fruits[rand3]}</div>`;
    
    // Dönme animasyonunu başlat
    const reels = [reel1, reel2, reel3];
    reels.forEach(reel => {
        const randomFruitIndex = Math.floor(Math.random() * fruits.length);
        reel.firstChild.style.transform = `translateY(-${(150 * (randomFruitIndex + 1))}px)`;
    });

    setTimeout(() => {
        const finalFruit1 = fruits[Math.floor(Math.random() * fruits.length)];
        const finalFruit2 = fruits[Math.floor(Math.random() * fruits.length)];
        const finalFruit3 = fruits[Math.floor(Math.random() * fruits.length)];

        reel1.innerHTML = `<div>${finalFruit1}</div>`;
        reel2.innerHTML = `<div>${finalFruit2}</div>`;
        reel3.innerHTML = `<div>${finalFruit3}</div>`;
        
        checkResult(finalFruit1, finalFruit2, finalFruit3);
    }, 1000); // Animasyon süresi
});

function checkResult(r1, r2, r3) {
    if (r1 === r2 && r2 === r3) {
        resultDiv.textContent = 'Tebrikler, kazandınız!';
    } else {
        resultDiv.textContent = 'Tekrar deneyin.';
    }
}
