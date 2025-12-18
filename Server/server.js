import express from "express";
import http from "http";
import { Server } from "socket.io";
import { GetCard, IncrementCardCount } from "./database.js";

const app = express();
const server = http.createServer(app);

let hasAdmin = false;
let currentAdmin = "";
let players = [];
let roundNumber = 0;
let playersMap = {};

const io = new Server(server, {
  cors: {
    origin: "http://192.168.2.64:5173",
    methods: ["GET", "POST"],
  },
});

/* ======================
   Helper Functions
====================== */

// Get a random player name
const getRandomUser = () => {
  if (players.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * players.length);
  return players[randomIndex].name;
};

// Initialize stats for all players
const InitializePlayerMap = () => {
  playersMap = {};
  players.forEach((player) => {
    playersMap[player.name] = { truth: 0, drink: 0 };
  });
};

// Safely update player stats
const HandleMapUpdate = ({ player, choice }) => {
  if (!player || !["truth", "drink"].includes(choice)) return;

  if (!playersMap[player]) {
    // Initialize if missing
    playersMap[player] = { truth: 0, drink: 0 };
  }

  playersMap[player][choice]++;
};

/* ======================
   Game Functions
====================== */

// Send a new round package to all clients
const SendNewRoundPackage = async ({ player, choice } = {}) => {
  roundNumber++;
  if (player && choice) {
    HandleMapUpdate({ player, choice });
  }

  try {
    const card = await GetCard();
    const dataPack = {
      round: roundNumber,
      playerStats: playersMap,
      newCard: card,
      chosenPlayer: getRandomUser(),
    };
    io.emit("NewRound", dataPack);
  } catch (err) {
    console.log("Error getting card:", err);
  }
};

// Start the game
const SendStartGamePackage = () => {
  if (players.length === 0) return;
  roundNumber = 0;
  InitializePlayerMap();
  SendNewRoundPackage();
};

/* ======================
   Socket.IO Connections
====================== */
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Assign admin if none exists
  if (!hasAdmin) {
    socket.emit("becomeAdmin");
    hasAdmin = true;
    currentAdmin = socket.id;
  }

  // Add user to lobby
  socket.on("addUser", (name) => {
    if (players.some((p) => p.id === socket.id)) return;
    players.push({ id: socket.id, name });
    io.emit("usersUpdated", players);
  });

  // Start game request
  socket.on("startGame", () => {
    SendStartGamePackage();
  });

  // Next round request
  socket.on("nextRound", async ({ player, choice, cardID }) => {
    try {
      // Update stats
      HandleMapUpdate({ player, choice });

      // Update card in database
      if (cardID) {
        await IncrementCardCount({ cardID, choice });
      }

      // Send new round
      SendNewRoundPackage({ player, choice });
    } catch (err) {
      console.log("Error in nextRound:", err);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    players = players.filter((p) => p.id !== socket.id);
    io.emit("usersUpdated", players);

    // Reassign admin if necessary
    if (socket.id === currentAdmin) {
      hasAdmin = false;
      currentAdmin = "";
      if (players.length > 0) {
        const newAdmin = players[0];
        hasAdmin = true;
        currentAdmin = newAdmin.id;
        io.to(newAdmin.id).emit("becomeAdmin");
        console.log("New admin assigned:", newAdmin.id);
      }
    }
  });
});

/* ======================
   Start Server
====================== */
server.listen(3000, "0.0.0.0", () => {
  console.log("Socket server running on port 3000");
});
