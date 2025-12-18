import express from "express";
import http from "http";
import { Server } from "socket.io";
import GetCard from "./database.js";

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

// Helper Functions
const getRandomUser = () => {
  // Selects a random User
  if (players.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * players.length);
  const chosenPlayer = players[randomIndex];

  console.log("Random user chosen:", chosenPlayer);
  return chosenPlayer.name;
};

const InitializePlayerMap = () => {
  playersMap = {};
  players.forEach((player) => {
    playersMap[player.name] = {
      truth: 0,
      drink: 0,
    };
  });
};

const HandleMapUpdate = ({ player, choice }) => {
  if (choice === "truth") {
    playersMap[player].truth++;
  } else {
    playersMap[player].drink++;
  }
};

// Final Functions

const SendNewRoundPackage = ({ player, choice } = {}) => { // Sends the data for the new round
  roundNumber++;
  if (player && choice) {
    HandleMapUpdate({ player, choice });
  }
  GetCard((err, card) => {
    if (err) return;
    const dataPack = {
      round: roundNumber,
      playerStats: playersMap,
      newCard: card,
      chosenPlayer: getRandomUser(),
    };
    io.emit("NewRound", dataPack);
  });
};

const SendStartGamePackage = () => { // Prepares the server and sends the data to start the round
  if (players.length === 0) return;
  roundNumber = 0;
  InitializePlayerMap();
  SendNewRoundPackage();
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Finds Admin for the game
  if (!hasAdmin) {
    socket.emit("becomeAdmin");
    hasAdmin = true;
    currentAdmin = socket.id;
  }

  // Adding User
  socket.on("addUser", (name) => {
    if (players.some((p) => p.id === socket.id)) return;
    players.push({ id: socket.id, name });
    io.emit("usersUpdated", players);
  });

  // When we recieve a start game request
  socket.on("startGame", () => {
    SendStartGamePackage();
  });

  // when we recieve a next round request
  socket.on("nextRound", ({ player, choice }) => {
    SendNewRoundPackage({ player, choice });
  });

  // Handles Disconnections
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    players = players.filter((p) => p.id !== socket.id);
    io.emit("usersUpdated", players);
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

// Server //
server.listen(3000, "0.0.0.0", () => {
  console.log("Socket server running on port 3000");
});
