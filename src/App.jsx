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

  /* ======================
     Socket Core Setup
  ====================== */
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("becomeAdmin", () => {
      console.log("You are admin");
      setIsAdmin(true);
    });

    return () => {
      socket.off("connect");
      socket.off("becomeAdmin");
    };
  }, []);

  /* ======================
     Join Lobby
  ====================== */
  const setName = (name) => {
    setUser(name);
    socket.emit("addUser", name);
  };

  /* ======================
     Users Updated
  ====================== */
  useEffect(() => {
    const handleUsersUpdated = (users) => {
      setCurrentUsers(users);
    };

    socket.on("usersUpdated", handleUsersUpdated);
    return () => socket.off("usersUpdated", handleUsersUpdated);
  }, []);

  /* ======================
     NEW ROUND (single source of truth)
  ====================== */
  useEffect(() => {
    const handleNewRound = (dataPack) => {
      console.log("New round package:", dataPack);

      setGameState("Game");
      setCurrentCard(dataPack.newCard);
      setSelectedUser(dataPack.chosenPlayer);
      setPlayerStats(dataPack.playerStats);
    };

    socket.on("NewRound", handleNewRound);
    return () => socket.off("NewRound", handleNewRound);
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
    }

    return (
      <>
        <Navbar />
        <Lobby callbackFunction={setName} players={currentUsers} />
      </>
    );
  }

  // GAME STATE
  if (isAdmin) {
    return (
      <>
        <Navbar />
        <AdminGame
          currentCard={currentCard}
          playerStats={playerStats}
          selectedUser={selectedUser}
        />
      </>
    );
  }

  if (selectedUser === user) {
    return (
      <>
        <Navbar />
        <SelectedPlayer currentCard={currentCard, user} />
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
