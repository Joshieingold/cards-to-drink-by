import "./App.css";
import Navbar from "./components/navbar/navbar.jsx";
import SelectedPlayer from "./pages/selectedPlayer.jsx";
import AdminGame from "./pages/adminGame.jsx";
import AdminLobby from "./pages/adminLobby.jsx";
import GeneralPlayer from "./pages/generalPlayer.jsx";
import Lobby from "./pages/lobby.jsx";
import { useState } from "react";
import { socket } from "./components/socket.js";
import { useEffect } from "react";

function App() {
  const [user, setUser] = useState("");
  const [gameState, setGameState] = useState("Lobby");
  const [selectedUser, setSelectedUser] = useState(false);
  const [currentUsers, setCurrentUsers] = useState([]);
  const [currentCard, setCurrentCard] = useState("");

 useEffect(() => {
  socket.on("connect", () => {
    console.log("Connected:", socket.id);
  });

  socket.on("becomeAdmin", () => {
    setUser("Admin");
  });

  return () => {
    socket.off("becomeAdmin");
  };
}, []);

// Helper Functions
const setName = (name) => {
  setUser(name);
  socket.emit("addUser", name);
};

useEffect(() => {
  const handleUsersUpdated = (userList) => {
    setCurrentUsers(userList);
  };

  socket.on("usersUpdated", handleUsersUpdated);

  return () => {
    socket.off("usersUpdated", handleUsersUpdated);
  };
}, []);
useEffect(() => {
  const handleStartGame = () => {
    setGameState("Game");
  }
  socket.on("startGame", handleStartGame);
  return () => {
    socket.off("startGame", handleStartGame)
  };
}, []);
useEffect(() => {
  const handleNewCard = (card) => {
    console.log(`Card received for user ${socket.id}:`, card);
    setCurrentCard(card);
  };

  socket.on("newCard", handleNewCard);

  return () => {
    socket.off("newCard", handleNewCard);
  };
}, []);


  if (gameState == "Lobby") {
    if (user == "Admin") {
      return (
        <>
          <Navbar />
          <AdminLobby players={currentUsers}/>
        </>
      );
    } else {
      return (
        <>
          <Navbar />
          <Lobby callbackFunction={setName}
          players={currentUsers}/>
        </>
      );
    }
  } else {
    if (user == "Admin") {
      return (
        <>
          <Navbar />
          <AdminGame currentCard={currentCard}/>
        </>
      );
    } else {
      if (selectedUser) {
        return (
          <>
            <Navbar />
            <SelectedPlayer currentCard={currentCard}/>
          </>
        );
      } else {
        return (
          <>
            <Navbar />
            <GeneralPlayer />
          </>
        );
      }
    }
  }
}

export default App;

// npm run dev -- --host
// node ./index.js