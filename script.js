const fruits = ['🍒', '🍋', '🍊', '🍏', '🍉', '🍇'];
const spinButton = document.getElementById('spin-button');
const resultDiv = document.getElementById('result');

spinButton.addEventListener('click', () => {
    const reel1 = document.getElementById('reel1');
    const reel2 = document.getElementById('reel2');
    const reel3 = document.getElementById('reel3');

    const rand1 = fruits[Math.floor(Math.random() * fruits.length)];
    const rand2 = fruits[Math.floor(Math.random() * fruits.length)];
    const rand3 = fruits[Math.floor(Math.random() * fruits.length)];

    reel1.textContent = rand1;
    reel2.textContent = rand2;
    reel3.textContent = rand3;

    checkResult(rand1, rand2, rand3);
});

function checkResult(r1, r2, r3) {
    if (r1 === r2 && r2 === r3) {
        resultDiv.textContent = 'Tebrikler, kazandınız!';
    } else {
        resultDiv.textContent = 'Tekrar deneyin.';
    }
}
