let balance = 100; // Başlangıç bakiyesi

function spin() {
    const wheel = document.querySelector('.wheel');
    const randomize = Math.floor(Math.random() * 360);
    wheel.style.setProperty('--randomize', randomize);
    setTimeout(() => {
        const winningIndex = Math.floor(randomize / 36) % 10;
        const winningSlice = document.querySelector(`.slice:nth-child(${winningIndex + 1}) .value`);
        const winnings = parseInt(winningSlice.textContent);
        updateBalance(winnings);
        showResultPopup(winnings);
    }, 3000); // Çarkın dönüş süresi
}

function updateBalance(amount) {
    balance += amount;
    console.log(`Yeni Bakiye: $${balance}`);
}

function showResultPopup(amount) {
    const resultPopup = document.getElementById('resultPopup');
    const resultMessage = document.getElementById('resultMessage');
    resultMessage.innerText = `${amount} kazandınız!`;
    resultPopup.classList.remove('hidden');
}

function closeResultPopup() {
    const resultPopup = document.getElementById('resultPopup');
    resultPopup.classList.add('hidden');
}
