import express from "express";
import http from "http";
import { Server } from "socket.io";
import mysql from "mysql2";

// MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "truth_or_drink",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Helper function to get a random card
const getCard = (callback) => {
  pool.query("SELECT * FROM cards ORDER BY RAND() LIMIT 1;", (err, results) => {
    if (err) {
      console.error("DB error:", err);
      callback(err, null);
      return;
    }
    callback(null, results[0]); // return the first card
  });
};

// Express setup
const app = express();
const server = http.createServer(app);

// Game state
let hasAdmin = false;
let currentAdmin = "";
let players = [];

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://192.168.2.64:5173",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Assign admin if none exists
  if (!hasAdmin) {
    socket.emit("becomeAdmin");
    hasAdmin = true;
    currentAdmin = socket.id;
  }

  // Add player
  socket.on("addUser", (name) => {
    if (players.some(p => p.id === socket.id)) return;

    players.push({ id: socket.id, name });
    io.emit("usersUpdated", players);
  });

  // Start game (admin)
  socket.on("startGame", () => {
    io.emit("startGame");

    // Draw a card and emit to all players
    getCard((err, card) => {
      if (err) return;
      io.emit("newCard", card);
      console.log("Card sent to players:", card);
    });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    players = players.filter(p => p.id !== socket.id);
    io.emit("usersUpdated", players);

    if (socket.id === currentAdmin) {
      hasAdmin = false;
      currentAdmin = "";
    }

    console.log("User disconnected:", socket.id);
  });
});

// Start server
server.listen(3000, "0.0.0.0", () => {
  console.log("Socket server running on port 3000");
});
