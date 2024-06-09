document.addEventListener("DOMContentLoaded", () => {
    const slots = ["🍒", "🍋", "🍊", "🍉", "🍇", "🍓"];
    const slot1 = document.getElementById("slot1");
    const slot2 = document.getElementById("slot2");
    const slot3 = document.getElementById("slot3");
    const spinButton = document.getElementById("spin-button");
    const message = document.getElementById("message");
    const scoresList = document.getElementById("scores");

    let username = localStorage.getItem("username");

    if (!username) {
        username = prompt("Lütfen kullanıcı adınızı girin:");
        localStorage.setItem("username", username);
    }

    function updateScores() {
        const scores = JSON.parse(localStorage.getItem("scores")) || [];
        scoresList.innerHTML = scores.map(score => `<li>${score.username}: ${score.score}</li>`).join("");
    }

    function addScore(username, score) {
        const scores = JSON.parse(localStorage.getItem("scores")) || [];
        scores.push({ username, score });
        localStorage.setItem("scores", JSON.stringify(scores));
        updateScores();
    }

    spinButton.addEventListener("click", () => {
        const result1 = slots[Math.floor(Math.random() * slots.length)];
        const result2 = slots[Math.floor(Math.random() * slots.length)];
        const result3 = slots[Math.floor(Math.random() * slots.length)];

        slot1.textContent = result1;
        slot2.textContent = result2;
        slot3.textContent = result3;

        if (result1 === result2 && result2 === result3) {
            message.textContent = "Kazandınız! Skorunuz 100!";
            addScore(username, 100);
        } else {
            message.textContent = "Kaybettiniz. Tekrar deneyin!";
        }
    });

    updateScores();
});
