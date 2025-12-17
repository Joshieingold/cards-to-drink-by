import "./App.css";
import Navbar from "./components/navbar/navbar.jsx";
import SelectedPlayer from "./pages/selectedPlayer.jsx";
import AdminGame from "./pages/adminGame.jsx";
import AdminLobby from "./pages/adminLobby.jsx";
import GeneralPlayer from "./pages/generalPlayer.jsx";
import Lobby from "./pages/lobby.jsx";
import { useState, useEffect } from "react";
import { socket } from "./components/socket.js";

function App() {
  const [user, setUser] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [gameState, setGameState] = useState("Lobby");
  const [selectedUser, setSelectedUser] = useState("");
  const [currentUsers, setCurrentUsers] = useState([]);
  const [currentCard, setCurrentCard] = useState("");

  /* ======================
     Socket Setup
  ====================== */
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("becomeAdmin", () => {
      setIsAdmin(true);
      console.log("You are admin");
    });

    return () => {
      socket.off("connect");
      socket.off("becomeAdmin");
    };
  }, []);

  /* ======================
     Helper
  ====================== */
  const setName = (name) => {
    setUser(name);
    socket.emit("addUser", name);
  };

  /* ======================
     Users Updated
  ====================== */
  useEffect(() => {
    const handleUsersUpdated = (userList) => {
      setCurrentUsers(userList);
    };

    socket.on("usersUpdated", handleUsersUpdated);
    return () => socket.off("usersUpdated", handleUsersUpdated);
  }, []);

  /* ======================
     Start Game
  ====================== */
  useEffect(() => {
    const handleStartGame = () => {
      setGameState("Game");
    };

    socket.on("startGame", handleStartGame);
    return () => socket.off("startGame", handleStartGame);
  }, []);

  /* ======================
     New Card
  ====================== */
  useEffect(() => {
    const handleNewCard = (card) => {
      console.log("Card received:", card);
      setCurrentCard(card);
    };

    socket.on("newCard", handleNewCard);
    return () => socket.off("newCard", handleNewCard);
  }, []);

  /* ======================
     Selected Player
  ====================== */
  useEffect(() => {
    const handleSelectedPlayer = (player) => {
      console.log("Chosen player:", player);
      setSelectedUser(player?.name || "");
    };

    socket.on("selectedPlayer", handleSelectedPlayer);
    return () => socket.off("selectedPlayer", handleSelectedPlayer);
  }, []);

  /* ======================
     Rendering
  ====================== */
  if (gameState === "Lobby") {
    if (isAdmin) {
      return (
        <>
          <Navbar />
          <AdminLobby players={currentUsers} />
        </>
      );
    } else {
      return (
        <>
          <Navbar />
          <Lobby callbackFunction={setName} players={currentUsers} />
        </>
      );
    }
  }

  // GAME STATE
  if (isAdmin) {
    return (
      <>
        <Navbar />
        <AdminGame currentCard={currentCard} />
      </>
    );
  }

  if (selectedUser === user) {
    return (
      <>
        <Navbar />
        <SelectedPlayer currentCard={currentCard} />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <GeneralPlayer />
    </>
  );
}

export default App;
