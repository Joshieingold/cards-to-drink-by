import express from "express";
import http from "http";
import { Server } from "socket.io";
import { CreateCard, GetCard, GetFiveCards } from "./database.js";

// Variables
const app = express();
const server = http.createServer(app);
let hasAdmin = false;
let currentAdmin = "";
let players = [];
let roundNumber = 0;
let playersMap = {};
const io = new Server(server, { cors: { origin: "http://192.168.2.64:5173", methods: ["GET", "POST"], }});

const getRandomUser = () => { // Selects a random player.
  if (players.length === 0) return null;
  return players[Math.floor(Math.random() * players.length)].name;
};

const InitializePlayerMap = () => { // Creates a map of all the players and adds missing ones.
  players.forEach((player) => {
    if (!playersMap[player.name]) {
      playersMap[player.name] = { truth: 0, drink: 0 };
    }
  });
};

const HandleMapUpdate = ({ player, choice }) => { // Handles adding to the player stats.
  if (!player || !["truth", "drink"].includes(choice)) return; // Handles if any data is mutated
  if (!playersMap[player]) { // Adds player if they arent there.
    playersMap[player] = { truth: 0, drink: 0 };
  }
  playersMap[player][choice]++; // Increments the player by their choice.
};

const SendNewRoundPackage = async () => { // Sends data to all clients about how the game state should look.
  roundNumber++;
  try {
    const card = await GetCard();
    io.emit("NewRound", { round: roundNumber, playerStats: playersMap, newCard: card, chosenPlayer: getRandomUser()});
  }
  catch (err) {
    console.log("Error getting card:", err);
  }
};

const SendStartGamePackage = () => { // Pings the clients to enter the game mode.
  if (players.length === 0) return;
  roundNumber = 0;
  InitializePlayerMap();
  SendNewRoundPackage();
};

io.on("connection", (socket) => { // Handles recieving a connection from a user and sends all the users back.
  console.log("User connected:", socket.id);
  if (!hasAdmin) { // If theres no admin the first user is the admin
    socket.emit("becomeAdmin");
    hasAdmin = true;
    currentAdmin = socket.id;
  }
  socket.on("addUser", (name) => { // Add user
    if (players.some((p) => p.id === socket.id)) return;
    players.push({ id: socket.id, name });
    InitializePlayerMap();
    io.emit("usersUpdated", players);
  });

  socket.on("createCardRequest", ({ title, description, creator }) => { // recieves request to add new card and adds to database.
    CreateCard({title, description, creator});
  });

  socket.on("startGame", () => { // Waits for the start game request to ping all players with the data.
    if (socket.id !== currentAdmin) return;
    SendStartGamePackage();
  });

  socket.on("nextRound", ({ player, choice }) => { // Recieves request for new round and sends the round data.
    HandleMapUpdate({ player, choice });
    SendNewRoundPackage();
  });

  socket.on("requestFiveCards", async () => { // Sends 5 cards to the admin upon request.
  try {
    const cards = await GetFiveCards();

    // Normalize field names for frontend
    const formattedCards = cards.map(card => ({
      id: card.id,
      title: card.title,
      desc: card.description,
    }));

    socket.emit("fiveCards", formattedCards);
  } catch (err) {
    console.error("Error fetching five cards:", err);
    socket.emit("fiveCards", []);
  }
});


  socket.on("disconnect", () => { // Handles disconnection from the game.
    console.log("User disconnected:", socket.id);
    players = players.filter((p) => p.id !== socket.id);
    io.emit("usersUpdated", players);
    if (socket.id === currentAdmin) { // Reassign admin
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

server.listen(3000, "0.0.0.0", () => { // Starts the server
  console.log("Socket server running on port 3000");
});
