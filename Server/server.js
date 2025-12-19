import express from "express";
import http from "http";
import { Server } from "socket.io";
import { GetCard } from "./database.js";

const app = express();
const server = http.createServer(app);

/* ======================
   Server State
====================== */

let hasAdmin = false;
let currentAdmin = "";
let players = [];
let roundNumber = 0;
let playersMap = {};

/* ======================
   Socket.IO Setup
====================== */

const io = new Server(server, {
  cors: {
    origin: "http://192.168.2.64:5173",
    methods: ["GET", "POST"],
  },
});

/* ======================
   Helper Functions
====================== */

// Pick random player
const getRandomUser = () => {
  if (players.length === 0) return null;
  return players[Math.floor(Math.random() * players.length)].name;
};

// Initialize missing players only
const InitializePlayerMap = () => {
  players.forEach((player) => {
    if (!playersMap[player.name]) {
      playersMap[player.name] = { truth: 0, drink: 0 };
    }
  });
};

// Safely update stats
const HandleMapUpdate = ({ player, choice }) => {
  if (!player || !["truth", "drink"].includes(choice)) return;

  if (!playersMap[player]) {
    playersMap[player] = { truth: 0, drink: 0 };
  }

  playersMap[player][choice]++;
};

/* ======================
   Game Functions
====================== */

// Send new round (NO stat updates here)
const SendNewRoundPackage = async () => {
  roundNumber++;

  try {
    const card = await GetCard();

    io.emit("NewRound", {
      round: roundNumber,
      playerStats: playersMap,
      newCard: card,
      chosenPlayer: getRandomUser(),
    });

    console.log("New round sent:", playersMap);
  } catch (err) {
    console.log("Error getting card:", err);
  }
};

// Start game
const SendStartGamePackage = () => {
  if (players.length === 0) return;

  roundNumber = 0;
  InitializePlayerMap();
  SendNewRoundPackage();
};

/* ======================
   Socket.IO Events
====================== */

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Assign admin
  if (!hasAdmin) {
    socket.emit("becomeAdmin");
    hasAdmin = true;
    currentAdmin = socket.id;
  }

  // Add user
  socket.on("addUser", (name) => {
    if (players.some((p) => p.id === socket.id)) return;

    players.push({ id: socket.id, name });
    InitializePlayerMap();

    io.emit("usersUpdated", players);
  });

  // Start game
  socket.on("startGame", () => {
    if (socket.id !== currentAdmin) return;
    SendStartGamePackage();
  });

  // Next round
  socket.on("nextRound", ({ player, choice }) => {
    HandleMapUpdate({ player, choice });
    SendNewRoundPackage();
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    players = players.filter((p) => p.id !== socket.id);
    io.emit("usersUpdated", players);

    // Reassign admin
    if (socket.id === currentAdmin) {
      hasAdmin = false;
      currentAdmin = "";

      if (players.length > 0) {
        const newAdmin = players[0];
        hasAdmin = true;
        currentAdmin = newAdmin.id;
        io.to(newAdmin.id).emit("becomeAdmin");
        console.log("New admin:", newAdmin.id);
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
