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

// npm run dev -- --host
// node ./index.js