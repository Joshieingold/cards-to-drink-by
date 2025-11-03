import WebSocket, { WebSocketServer } from "ws";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase.js"; // adjust path if needed

const wss = new WebSocketServer({ port: 8082 });
let players = [];   // { name, ws }
let gameState = "lobby";
let deck = [];

wss.on("connection", (ws) => {
  console.log("New Client has connected!");

  // Send current game state when someone connects
  BroadcastGameStateUpdate(gameState);

  ws.on("message", async (data) => {
    let msg;
    try {
      msg = JSON.parse(data);
    } catch (err) {
      console.error("Invalid JSON received:", data, err);
      return;
    }

    // Player joins
    if (msg.type === "join") {
      players.push({ name: msg.name, ws });
      BroadcastPlayers();
    }

    // Client wants to know current state
    if (msg.type === "requestGameState") {
      BroadcastGameStateUpdate(gameState);
    }

    // Change game state (from lobby > countdown > game...)
    if (msg.type === "changeGameState") {
      gameState = msg.state;
      BroadcastGameStateUpdate(gameState);

      // When the game actually starts → load deck from Firestore
      if (gameState === "game") {
        await GetDeck();
      }
    }

    // Player asks for a card during game
    if (msg.type === "requestCard" && gameState === "game") {
      SendCard();
    }
  });

  ws.on("close", () => {
    players = players.filter((p) => p.ws !== ws);
    BroadcastPlayers();
    console.log("Player Disconnected");
  });
});

// Broadcast player names to all clients
function BroadcastPlayers() {
  const playerNames = players.map((p) => p.name);
  const message = JSON.stringify({ type: "updatePlayers", players: playerNames });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Broadcast game state to all clients
function BroadcastGameStateUpdate(updateTo) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "gameState", state: updateTo }));
    }
  });
}

// Load deck from Firestore
async function GetDeck() {
  deck = []; // reset old deck

  const collectionRef = collection(db, "cards");
  const querySnapshot = await getDocs(collectionRef);

  querySnapshot.forEach((doc) => {
    deck.push({ id: doc.id, ...doc.data() });
  });

  console.log("Deck loaded from Firestore:", deck.length, "cards");
}

// Send a random card to everyone (one gets to play, others spectate)
function SendCard() {
  if (deck.length === 0 || players.length === 0) {
    console.log("No cards or players available.");
    return;
  }

  const randomCard = deck[Math.floor(Math.random() * deck.length)];
  const randomPlayer = players[Math.floor(Math.random() * players.length)];

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
        console.log(JSON.stringify({player: randomPlayer.name, card: randomCard}))
      client.send(
        JSON.stringify({
          type: "card",
          player: randomPlayer.name,
          card: randomCard,
        })
      );
    }
  });
}
