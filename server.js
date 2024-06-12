const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

let players = [];

server.on('connection', (socket) => {
    const player = {
        id: socket,
        x: Math.random() * 800,
        y: Math.random() * 600,
        radius: 20,
        color: 'white'
    };
    
    players.push(player);
    
    socket.send(JSON.stringify({ type: 'init', data: player }));
    
    socket.on('message', (message) => {
        const data = JSON.parse(message);
        
        if (data.type === 'move') {
            player.x = data.x;
            player.y = data.y;
        }

        broadcast(JSON.stringify({ type: 'update', data: players }));
    });

    socket.on('close', () => {
        players = players.filter(p => p.id !== socket);
        broadcast(JSON.stringify({ type: 'update', data: players }));
    });
});

function broadcast(message) {
    server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}
