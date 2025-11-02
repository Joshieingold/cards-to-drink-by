import "./App.css";
import "./css/styles.css";
import "./css/bubble.css";
import "./css/responsive.css";
import React, { useState, useEffect, useRef } from "react";

import cardIcon from "./assets/cards.png";

import Navbar from "./components/navbar/navbar.jsx";
import JoinBubble from "./components/joinbubble/joinbubble.jsx";
import AddCardForm from "./components/addcardform/addcardform.jsx";
import Countdown from "./components/countdown/countdown.jsx";
import LobbyBubble from "./components/lobbybubble/lobbybubble.jsx";

function App() {
  const [players, setPlayers] = useState([]);
  const [newCardActive, setNewCardActive] = useState(false);
  const [gameState, setGameState] = useState();
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
      if (msg.type === "globalCountdown") {
        setGameState("countdown");
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
 const handlePingGamestate = (gameState) => {
    wsRef.current.send(JSON.stringify({ type: "update", state: gameState}));
  } 

  return (
    <div className="home-container">
      <Navbar setGameState={setGameState} />
      <div className="bubble-container">
        <JoinBubble onJoin={handleAddPlayer} />
        <LobbyBubble players={players} />
      </div>
      <button className="add-card-button" onClick={() => setNewCardActive(true)}>
        <span className="btn-text">Add Card</span>
        <span className="btn-icon">
          <img src={cardIcon}></img>
        </span>
      </button>
      <button onClick={() => handlePingGamestate("countdown")}>Change ALL GAME STATE</button>
      {newCardActive ? ( <AddCardForm setNewCardActive={setNewCardActive} />) : ( <div></div>)}
      {gameState === "countdown" ? ( <Countdown onFinish={() => setGameState("lobby")} />) : ( <div></div>)}
    </div>
  );
}
export default App;
