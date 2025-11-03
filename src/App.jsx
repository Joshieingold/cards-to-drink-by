import "./App.css";
import "./css/styles.css";
import "./css/bubble.css";
import "./css/responsive.css";
import React, { useState, useEffect, useRef } from "react";

import QR from "./assets/qr-code.png";
import Navbar from "./components/navbar/navbar.jsx";
import JoinBubble from "./components/joinbubble/joinbubble.jsx";
import AddCardForm from "./components/addcardform/addcardform.jsx";
import Countdown from "./components/countdown/countdown.jsx";
import LobbyBubble from "./components/lobbybubble/lobbybubble.jsx";

function App() {
  const [players, setPlayers] = useState([]);
  const [localGameState, setLocalGameState] = useState("lobby");
  const [isHost, setIsHost] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket("ws://192.168.2.64:8082");
    wsRef.current = ws;
    ws.onopen = () => console.log("Connected!");

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "updatePlayers") {
        setPlayers(msg.players);
      }
      if (msg.type === "gameState") {
        if (isHost === false) {
          setLocalGameState(msg.state);
        }
      }
    };

    ws.onclose = () => console.log("Disconnected from the server");
    return () => ws.close();
  }, []);

  const handleAddPlayer = (name) => {
    if (name.trim() !== "") {
      wsRef.current.send(JSON.stringify({ type: "join", name }));
    }
  };
  const handleBecomeHost = () => {
    setLocalGameState("host");
    setIsHost(true);
  };
  const handleStopHost = () => {
    setIsHost(false);
  }
  const AskCurrentGameState = () => {
    wsRef.current.send(JSON.stringify({ type: "requestGameState"}));
  }
  const RequestGameStateChange = (newState) => {
    wsRef.current.send(JSON.stringify({ type: "changeGameState", state: newState}));
  };
  const GeneratePage = (gameState) => {
    switch (gameState) {
      case "lobby":
        return (
          <div className="bubble-container">
            <JoinBubble onJoin={handleAddPlayer} />
            <LobbyBubble players={players} />
          </div>
        );
      case "countdown":
        return (
          <div className="bubble-container">
            <JoinBubble onJoin={handleAddPlayer} />
            <LobbyBubble players={players} />
            <Countdown onFinish={RequestGameStateChange("game")} />
          </div>
        );
      case "host":
        return (
          <div className="bubble-container">
            <h2>You are the Host</h2>
            <LobbyBubble players={players} />
            <button onClick={() => handleStopHost()}>Back to Lobby</button>
            <button onClick={() => RequestGameStateChange("lobby")}>Restart Game</button>
            <button onClick={() => RequestGameStateChange("countdown")}>
              Start Countdown
            </button>
          </div>
        );
      case "game":
        return (
          <div className="bubble-container">
            <h2>Game in Progress</h2>
            <LobbyBubble players={players} />
          </div>
        );
    }
  };

  return (
    <div className="home-container">
      <Navbar/>
      {GeneratePage(localGameState)}
      <button onClick={() => handleBecomeHost()}>Become Host</button>
    </div>
  );
}
export default App;
