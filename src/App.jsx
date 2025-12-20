import "./App.css";
import Navbar from "./components/navbar/navbar.jsx";
import SelectedPlayer from "./pages/selectedPlayer.jsx";
import AdminGame from "./pages/adminGame.jsx";
import AdminLobby from "./pages/adminLobby.jsx";
import GeneralPlayer from "./pages/generalPlayer.jsx";
import Lobby from "./pages/lobby.jsx";
import { useState, useEffect } from "react";
import { socket } from "./components/socket.js";

function App() { // Variables
  const [user, setUser] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [gameState, setGameState] = useState("Lobby");
  const [currentUsers, setCurrentUsers] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [playerStats, setPlayerStats] = useState({});
  const [round, setRound] = useState(0); 

  // Use Effects
  useEffect(() => { // Handles Connections and setting the admin on connection.
    const handleConnect = () => {
      console.log("Connected:", socket.id);
    };
    const handleBecomeAdmin = () => {
      setIsAdmin(true);
    };

    socket.on("connect", handleConnect);
    socket.on("becomeAdmin", handleBecomeAdmin);
    return () => {
      socket.off("connect", handleConnect);
      socket.off("becomeAdmin", handleBecomeAdmin);
    };
  }, []);

  useEffect(() => { // Handles getting new user data and setting it for the local instance.
    const handleUsersUpdated = (users) => {
      setCurrentUsers(users);
    };

    socket.on("usersUpdated", handleUsersUpdated);
    return () => socket.off("usersUpdated", handleUsersUpdated);
  }, []);

  useEffect(() => { // Handles recieving data from the server and setting all properties.
    const handleNewRound = (dataPack) => {
      setGameState("Game");
      setCurrentCard(dataPack.newCard);
      setSelectedUser(dataPack.chosenPlayer);
      setPlayerStats(dataPack.playerStats);
      setRound(dataPack.round); 
    };

    socket.on("NewRound", handleNewRound);
    return () => socket.off("NewRound", handleNewRound);
  }, []);

  const setName = (name) => { // Allows the button to set name of the user.
    if (!name) return;
    setUser(name);
    socket.emit("addUser", name);
  };


  // Chooses page the user sees based on variables it has.
  if (gameState === "Lobby") {
    if (isAdmin) {
      return (<>
      <Navbar/>
      <AdminLobby players={currentUsers}/>
      </>);
    }
      return (<>
      <Navbar/>
      <Lobby callbackFunction={setName} players={currentUsers}/>
      </>);
  }

  if (isAdmin) {
    return (<>
    <Navbar/>
    <AdminGame currentCard={currentCard} playerStats={playerStats} selectedUser={selectedUser} round={round} chosenUser={selectedUser}/>
    </>);
  }
  if (selectedUser === user) {
    return(<>
    <Navbar/>
    <SelectedPlayer currentCard={currentCard} user={user}/>
    </>);
  }
  return (<>
  <Navbar/>
  <GeneralPlayer round={round}/>
  </>);
}

export default App;
// Need to add mini cards to the admin lobby