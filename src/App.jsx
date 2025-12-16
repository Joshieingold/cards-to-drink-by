import "./App.css";
import Navbar from "./components/navbar/navbar.jsx";
import SelectedPlayer from "./pages/selectedPlayer.jsx";
import AdminGame from "./pages/adminGame.jsx";
import AdminLobby from "./pages/adminLobby.jsx";
import GeneralPlayer from "./pages/generalPlayer.jsx";
import Lobby from "./pages/lobby.jsx";
import { useState } from "react";

function App() {
  const [user, setUser] = useState("");
  const [gameState, setGameState] = useState("Lobby");
  const [selectedUser, setSelectedUser] = useState(false);
  if (gameState == "Lobby") {
    if (user == "Admin") {
      return (
        <>
          <Navbar />
          <AdminLobby />
        </>
      );
    } else {
      return (
        <>
          <Navbar />
          <Lobby />
        </>
      );
    }
  } else {
    if (user == "Admin") {
      return (
        <>
          <Navbar />
          <AdminGame />
        </>
      );
    } else {
      if (selectedUser) {
        return (
          <>
            <Navbar />
            <SelectedPlayer />
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

