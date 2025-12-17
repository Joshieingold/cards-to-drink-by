import express from "express";
import http from "http";
import { Server } from "socket.io";
import mysql from "mysql2";
import Getcard from "./database.js"

/* =========================
   Express + HTTP
========================= */
const app = express();
const server = http.createServer(app);

/* =========================
   Game State
========================= */
let hasAdmin = false;
let currentAdmin = "";
let players = [];
let roundNumber = 1;


/* =========================
   Helpers
========================= */
const getRandomUser = () => {
  if (players.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * players.length);
  const chosenPlayer = players[randomIndex];

  console.log("Random user chosen:", chosenPlayer);
  return chosenPlayer;
};

/* =========================
   Socket.IO
========================= */
const io = new Server(server, {
  cors: {
    origin: "http://192.168.2.64:5173",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  /* ---------- Admin Assignment ---------- */
  if (!hasAdmin) {
    socket.emit("becomeAdmin");
    hasAdmin = true;
    currentAdmin = socket.id;
    console.log("Admin assigned:", socket.id);
  }

  /* ---------- Add Player ---------- */
  socket.on("addUser", (name) => {
    if (players.some((p) => p.id === socket.id)) return;

    players.push({ id: socket.id, name });
    console.log("Players:", players);

    io.emit("usersUpdated", players);
  });

  /* ---------- Start Game (Admin) ---------- */
  socket.on("startGame", () => {
    if (players.length === 0) return;

    io.emit("startGame");

    // Draw a card
    GetCard((err, card) => {
      if (err) return;
      io.emit("newCard", card);
      console.log("Card sent:", card);
    });

    // Select random player
    const selectedPlayer = getRandomUser();
    io.emit("selectedPlayer", selectedPlayer);
  });

  socket.on("choice", (playerName, action) =>)
  /* ---------- Disconnect ---------- */
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    players = players.filter((p) => p.id !== socket.id);
    io.emit("usersUpdated", players);

    // Reassign admin if needed
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

/* =========================
   Server Start
========================= */
server.listen(3000, "0.0.0.0", () => {
  console.log("Socket server running on port 3000");
});
