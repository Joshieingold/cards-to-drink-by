import './App.css';
import Navbar from './components/navbar/navbar.jsx';
import SelectedPlayer from "./pages/selectedPlayer.jsx";
import AdminGame from "./pages/adminGame.jsx";
import AdminLobby from "./pages/adminLobby.jsx";
import GeneralPlayer from './pages/generalPlayer.jsx';
import Lobby from "./pages/lobby.jsx";
import { useState } from 'react';

function App() {
  const [user, setUser] = useState("Admin");
  const [gameState, setGameState] = useState("Game");
  const [selectedUser, setSelectedUser] = useState(false);
  if (gameState == "Lobby") {
    if (user == "Admin") {
      return (
        <>
        <Navbar/>
        <AdminLobby/>
       </>
      )
    }
    else {

      return (
        <>
        <Navbar/>
        <Lobby/>
       </>
      )
    }
  }
  else {
    if (user == "Admin") {
      return (
        <>
        <Navbar/>
        <AdminGame/>
       </>
      )
    }
    else {
      if (selectedUser) {
        return (
        <>
          <Navbar/>
          <SelectedPlayer/>
        </>
        )
      }
      else {
        return (

        <>
          <Navbar/>
          <GeneralPlayer/>
        </>
        )
      }
    }
  }
}

export default App

// Admin Game Looks Good
// Admin Lobby Looks Good
// General Player cant look bad
// Lobby Looks good
// Now the selected player looks good
