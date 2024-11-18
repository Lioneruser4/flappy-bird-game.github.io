const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');
const winSound = document.getElementById('winSound');
const loseSound = document.getElementById('loseSound');

const fruits = ['🍒', '🍋', '🍉', '🍇', '🍓', '🍑', '🍍']; // Meyve simgeleri

function spin() {
    const result1 = fruits[Math.floor(Math.random() * fruits.length)];
    const result2 = fruits[Math.floor(Math.random() * fruits.length)];
    const result3 = fruits[Math.floor(Math.random() * fruits.length)];

    reel1.innerHTML = `<div>${result1}</div>`;
    reel2.innerHTML = `<div>${result2}</div>`;
    reel3.innerHTML = `<div>${result3}</div>`;

    animateReels(result1, result2, result3);
}

function animateReels(result1, result2, result3) {
    reel1.classList.add('spin');
    reel2.classList.add('spin');
    reel3.classList.add('spin');

    setTimeout(() => {
        reel1.classList.remove('spin');
        reel2.classList.remove('spin');
        reel3.classList.remove('spin');

        checkWin(result1, result2, result3);
    }, 2000); // Animasyon süresi
}

function checkWin(result1, result2, result3) {
    if (result1 === result2 && result2 === result3) {
        winSound.play();
        alert('Tebrikler! Kazandınız!');
    } else {
        loseSound.play();
        alert('Maalesef, kaybettiniz.');
    }
}
