import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8082});
wss.on("connection", ws => {
    console.log("New Client has connected!")
    ws.on("close", () => {
        console.log("Client has disconnected");
    });
});