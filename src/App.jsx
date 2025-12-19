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

  const [currentUsers, setCurrentUsers] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [playerStats, setPlayerStats] = useState({});
  const [round, setRound] = useState(0); // ✅ FIX: round state

  /* ======================
     Socket Setup
  ====================== */

  useEffect(() => {
    const handleConnect = () => {
      console.log("Connected:", socket.id);
    };

    const handleBecomeAdmin = () => {
      console.log("You are admin");
      setIsAdmin(true);
    };

    socket.on("connect", handleConnect);
    socket.on("becomeAdmin", handleBecomeAdmin);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("becomeAdmin", handleBecomeAdmin);
    };
  }, []);

  /* ======================
     User Join
  ====================== */

  const setName = (name) => {
    if (!name) return;
    setUser(name);
    socket.emit("addUser", name);
  };

  /* ======================
     Lobby Updates
  ====================== */

  useEffect(() => {
    const handleUsersUpdated = (users) => {
      setCurrentUsers(users);
    };

    socket.on("usersUpdated", handleUsersUpdated);
    return () => socket.off("usersUpdated", handleUsersUpdated);
  }, []);

  /* ======================
     Game Updates
  ====================== */

  useEffect(() => {
    const handleNewRound = (dataPack) => {
      console.log("New round package:", dataPack);

      setGameState("Game");
      setCurrentCard(dataPack.newCard);
      setSelectedUser(dataPack.chosenPlayer);
      setPlayerStats(dataPack.playerStats);
      setRound(dataPack.round); // ✅ FIX: round synced
    };

    socket.on("NewRound", handleNewRound);
    return () => socket.off("NewRound", handleNewRound);
  }, []);

  /* ======================
     Render Logic
  ====================== */

  // LOBBY
  if (gameState === "Lobby") {
    if (isAdmin) {
      return (
        <>
          <Navbar />
          <AdminLobby players={currentUsers} />
        </>
      );
    }

    return (
      <>
        <Navbar />
        <Lobby callbackFunction={setName} players={currentUsers} />
      </>
    );
  }

  // GAME — ADMIN
  if (isAdmin) {
    return (
      <>
        <Navbar />
        <AdminGame
          currentCard={currentCard}
          playerStats={playerStats}
          selectedUser={selectedUser}
          round={round} // ✅ FIX
          chosenUser={selectedUser}
        />
      </>
    );
  }

  // GAME — SELECTED PLAYER
  if (selectedUser === user) {
    return (
      <>
        <Navbar />
        <SelectedPlayer currentCard={currentCard} user={user} />
      </>
    );
  }

  // GAME — GENERAL PLAYER
  return (
    <>
      <Navbar />
      <GeneralPlayer />
    </>
  );
}

export default App;
