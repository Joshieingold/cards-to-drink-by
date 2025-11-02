import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8082});
let players = [];

wss.on("connection", ws => {
    console.log("New Client has connected!")
    ws.on("message", (data) => {
        const msg = JSON.parse(data);
        if (msg.type === "join") {
            players.push({name: msg.name, ws});
            BroadcastPlayers();
        }
        if (msg.type === "update") {
            BroadcastGameStateUpdate(msg.state);
        }
    })
    ws.on("close", () => {
        players = players.filter(p => p.ws !== ws);
        BroadcastPlayers();
        console.log("Player Disconnected");
    });
});
function BroadcastPlayers() {
    const playerNames = players.map(p => p.name);
    const message = JSON.stringify({type: "updatePlayers", players: playerNames});
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    })
}
function BroadcastGameStateUpdate(updateTo) {
    switch (updateTo) {
        case "countdown":
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: "globalCountdown", state: "globalCountdown"}));
                }
            })
            break;
        case "reveal-card":
            break;
        case "send-player-choice":
            break;
    }
}