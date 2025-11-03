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
  const [currentCardData, setCurrentCardData] = useState("")
  const [userID, setUserID] = useState("");
  const wsRef = useRef(null);
  useEffect(() => {
    if (userID) {
      console.log("User ID set to:", userID);
    }
  }, [userID]);
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
          console.log(isHost);
          setLocalGameState(msg.state);
        }
      }
      if (msg.type === "card") {
        console.log("card for " + msg.player + ": " + JSON.stringify(msg.card));
        setCurrentCardData(msg); 
      }
    };

    ws.onclose = () => console.log("Disconnected from the server");
    return () => ws.close();
  }, []);

  const handleAddPlayer = (name) => {
    if (name.trim() !== "") {
      wsRef.current.send(JSON.stringify({ type: "join", name }));
      setUserID(name);
    }
  };
  const handleBecomeHost = () => {
    setLocalGameState("host");
    RequestCard();
    setIsHost(true);
  };
  const handleStopHost = () => {
    setIsHost(false);
    AskCurrentGameState();
  };
  const AskCurrentGameState = () => {
    wsRef.current.send(JSON.stringify({ type: "requestGameState" }));
  };
  const RequestGameStateChange = (newState) => {
    wsRef.current.send(
      JSON.stringify({ type: "changeGameState", state: newState })
    );
  };
  const RequestCard = () => {
    wsRef.current.send(
      JSON.stringify({type: "requestCard"})
    )
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
            <div className="bubble">
              <div className="bubble-header">
                <h3>Join Here!</h3>
              </div>
              <div className="bubble-content">
                <img src={QR} className="qr-code"></img>
              </div>
            </div>
            <LobbyBubble players={players} />
            <div className="control-panel">
              <button onClick={() => handleStopHost()}>Back to Lobby</button>
              <button onClick={() => RequestGameStateChange("lobby")}>
                Restart Game
              </button>
              <button onClick={() => RequestGameStateChange("countdown")}>
                Start Countdown
              </button>
              <button onClick={() => RequestCard()}>Get New Card</button>
            </div>
          </div>
        );
      case "game":
        
        return (
          <div>
            <h2>{currentCardData ? currentCardData.player : ""}</h2>
            <h2>{currentCardData ? currentCardData.card.Text : ""}</h2>
            {(currentCardData.player === userID) ? 
            <div className="ChoiceButton">
              <button>Drink</button>
              <button>Answer</button>
            </div> : <div></div>}
          </div>
        ) 
    }
  };

  return (
    <div className="home-container">
      <Navbar />
      {GeneratePage(localGameState)}
      <button onClick={() => handleBecomeHost()}>Become Host</button>
    </div>
  );
}
export default App;
