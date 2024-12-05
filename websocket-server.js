const WebSocket = require('ws');

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

console.log('WebSocket server is running on ws://localhost:8080');

const players = {};

// Broadcast a message to all connected clients
function broadcast(message) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

wss.on('connection', (ws) => {
    console.log('A new player has connected.');

    // Assign a unique player ID
    const playerId = `player-${Date.now()}`;
    players[playerId] = { id: playerId };
    ws.send(JSON.stringify({ type: 'welcome', playerId }));

    // Listen for incoming messages
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            console.log('Received message:', message);

            if (message.type === 'move') {
                broadcast({ type: 'playerMoved', playerId, x: message.x, y: message.y });
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    // Handle client disconnect
    ws.on('close', () => {
        console.log(`Player ${playerId} disconnected.`);
        delete players[playerId];
        broadcast({ type: 'playerLeft', playerId });
    });
});
