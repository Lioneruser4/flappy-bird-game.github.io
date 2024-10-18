const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Aviator Oyunu Başlat
function startAviator() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Aviator Game Starting...", 50, 200);

    let height = 50;
    const speed = Math.random() * 5 + 1;

    function drawAviator() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.fillRect(140, height, 20, 20); // Uçak simgesi

        height += speed;

        if (height < canvas.height) {
            requestAnimationFrame(drawAviator);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillText("Game Over!", 100, 200);
        }
    }
    drawAviator();
}

// Slot Makinesi Başlat
function startSlot() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const symbols = ["🍒", "🔔", "⭐", "🍋"];
    const slots = [];

    function drawSlot() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "50px Arial";
        slots[0] = symbols[Math.floor(Math.random() * symbols.length)];
        slots[1] = symbols[Math.floor(Math.random() * symbols.length)];
        slots[2] = symbols[Math.floor(Math.random() * symbols.length)];

        ctx.fillText(slots[0], 50, 200);
        ctx.fillText(slots[1], 125, 200);
        ctx.fillText(slots[2], 200, 200);
    }

    drawSlot();
}
