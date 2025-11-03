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
  const [currentCardData, setCurrentCardData] = useState("");
  const [userID, setUserID] = useState("");
  const wsRef = useRef(null);

  // Logs the userID
  useEffect(() => {
    if (userID) {
      console.log("User ID set to:", userID);
    }
  }, [userID]);

  // WebSocket Message Recieving
  useEffect(() => {
    const ws = new WebSocket("ws://192.168.2.64:8082");
    wsRef.current = ws;

    ws.onopen = () => console.log("Connected!");
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "updatePlayers") {
        // Player list update recieved
        setPlayers(msg.players);
      }
      if (msg.type === "gameState") {
        // Game state update recieved
        if (isHost === false) {
          // Hosts arent affected
          setLocalGameState(msg.state);
        }
      }
      if (msg.type === "card") {
        // New card recieved
        setCurrentCardData(msg);
      }
    };
    ws.onclose = () => console.log("Disconnected from the server");
    return () => ws.close();
  }, []);

  // Local Handlers //

  // Tells the server the new player who joined
  const handleAddPlayer = (name) => {
    if (name.trim() !== "") {
      wsRef.current.send(JSON.stringify({ type: "join", name }));
      setUserID(name); // sets the local userID
    }
  };

  // Makes this client a host
  const handleBecomeHost = () => {
    setLocalGameState("host");
    RequestCard(); // DEBUG TO GET NEW CARD TO PREVENT NULL
    setIsHost(true);
  };

  // Makes this client a normal user again
  const handleStopHost = () => {
    setIsHost(false);
    AskCurrentGameState(); // Syncs up with the other players Game State
  };

  // SERVER REQUESTERS //

  // Requests the servers Game State to be sent to all clients
  const AskCurrentGameState = () => {
    wsRef.current.send(JSON.stringify({ type: "requestGameState" }));
  };

  // Requests for the server to change the Game State
  const RequestGameStateChange = (newState) => {
    wsRef.current.send(
      JSON.stringify({ type: "changeGameState", state: newState })
    );
  };

  // Requests the server to send all clients a card
  const RequestCard = () => {
    wsRef.current.send(JSON.stringify({ type: "requestCard" }));
  };

  // Changes the page content based on the local game state passed into it
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
          <div className="card-form-container">
            <div className="card-title-container">
              <h2>Question For {currentCardData ? currentCardData.player : ""}!</h2>
            </div>
            <div className="question-area">
              <h2 className="question-area">{currentCardData ? currentCardData.card.Text : ""}</h2>
            </div>
            <div className="choice-button-container">
            {currentCardData.player === userID ? (
              <div className="choice-buttons">
                <button className="choice-button">Drink</button>
                <button className="choice-button">Answer</button>
              </div>
            ) : (
              <div></div>
            )}
            </div>

          </div>
        );
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
