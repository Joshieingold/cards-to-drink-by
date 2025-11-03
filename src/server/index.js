import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8082});
let players = [];
let gameState = "lobby"; 

wss.on("connection", ws => {
    console.log("New Client has connected!")
    BroadcastGameStateUpdate(gameState);

    ws.on("message", (data) => {
        const msg = JSON.parse(data);
        if (msg.type === "join") {
            players.push({name: msg.name, ws});
            BroadcastPlayers();
        }
        if (msg.type === "requestGameState") {
            BroadcastGameStateUpdate(gameState);
        }
        if (msg.type === "changeGameState") {
            gameState = msg.state;
            BroadcastGameStateUpdate(gameState);
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
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "gameState", state: updateTo }));
    }
  });
}