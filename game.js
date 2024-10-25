const emojis = ["⭐", "⭐", "⭐"];
let probability = 0.7;  // Kazanma ihtimali
const reels = [document.getElementById("reel1"), document.getElementById("reel2"), document.getElementById("reel3")];

function spin() {
    document.getElementById("result").innerText = "";

    for (let i = 0; i < 3; i++) {
        reels[i].style.transform = "rotate(360deg)";
    }

    setTimeout(() => {
        let results = [];
        for (let i = 0; i < 3; i++) {
            if (Math.random() < probability) {
                results.push(emojis[Math.floor(Math.random() * emojis.length)]);
            } else {
                results.push(emojis[Math.floor(Math.random() * emojis.length)]);
            }
        }

        for (let i = 0; i < 3; i++) {
            reels[i].innerText = results[i];
            reels[i].style.transform = "rotate(0deg)";
        }

        checkJackpot(results);
    }, 500);
}

function checkJackpot(results) {
    const resultText = document.getElementById("result");
    if (results[0] === results[1] && results[1] === results[2]) {
        resultText.innerText = "Kazandınız!";
    } else {
        resultText.innerText = "Tekrar deneyin!";
    }
}
