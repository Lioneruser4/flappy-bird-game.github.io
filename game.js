const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const socket = new WebSocket('ws://YOUR_SERVER_IP:8080'); // YOUR_SERVER_IP adresini sunucu adresinizle değiştirin

let player = {};
let players = [];

socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    
    if (message.type === 'init') {
        player = message.data;
    } else if (message.type === 'update') {
        players = message.data;
    }
};

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            player.y -= 5;
            break;
        case 'ArrowDown':
            player.y += 5;
            break;
        case 'ArrowLeft':
            player.x -= 5;
            break;
        case 'ArrowRight':
            player.x += 5;
            break;
    }

    socket.send(JSON.stringify({ type: 'move', x: player.x, y: player.y }));
});

function drawPlayers() {
    players.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.closePath();
    });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayers();
    requestAnimationFrame(update);
}

update();
