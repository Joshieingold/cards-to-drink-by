import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

let hasAdmin = false;
let currentAdmin = "";

let players = [];

const io = new Server(server, {
  cors: {
    origin: "http://192.168.2.64:5173",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  if (!hasAdmin) {
    socket.emit("becomeAdmin");
    hasAdmin = true;
    currentAdmin = socket.id;
  }

  socket.on("addUser", (name) => {
    console.log("Adding user:", name);

    // prevent duplicate socket
    if (players.some(p => p.id === socket.id)) return;

    players.push({ id: socket.id, name });
    io.emit("usersUpdated", players);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    players = players.filter(p => p.id !== socket.id);
    io.emit("usersUpdated", players);

    if (socket.id === currentAdmin) {
      hasAdmin = false;
      currentAdmin = "";
    }
  });
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Socket server running on port 3000");
});
