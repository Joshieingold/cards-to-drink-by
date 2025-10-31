import "./App.css";
import "./css/home.css";
import React, { useState } from "react";
import glassesIcon from "./assets/glasses.png";
import cardIcon from "./assets/cards.png";

function App() {
  const [players, setPlayers] = useState([]); 

  // function to add a player
  const handleAddPlayer = (name) => {
    if (name.trim() !== "") {
      setPlayers((prev) => [...prev, name]);
    }
  };

  return (
    <div className="home-container">
      <Navbar />
      <div className="bubble-container">
        <JoinBubble onJoin={handleAddPlayer} />
        <LobbyBubble players={players} />
      </div>
      <button className="add-card-button">
        <span className="btn-text">Add Card</span>
        <span className="btn-icon">
          <img src={cardIcon} className="icon"></img>
        </span>
        </button>
    </div>
  );
}

export default App;



function JoinBubble({ onJoin }) {
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false); 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === "") return;
    onJoin(name);
    setJoined(true); 
  };

  return (
    <div className="bubble">
      <div className="bubble-header">
        <h3>{joined ? "Welcome" : "Join Game"}</h3>
      </div>
      <div className="bubble-content">
        {!joined ? (
          <form className="form-content" onSubmit={handleSubmit}>
            <h3>Enter Your Name</h3>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="username-box"
            />
            <button className="submit-button" type="submit">
              Join
            </button>
          </form>
        ) : (
          <div className="welcome-message">
            <h3>Welcome {name}!</h3>
          </div>
        )}
      </div>
    </div>
  );
}



function LobbyBubble({ players }) {
  return (
    <div className="bubble">
      <div className="bubble-header">
        <h3>Lobby</h3>
      </div>
      <div className="bubble-content">
        <ol className="player-list">
          {players.map((player, index) => (
            <li key={index}>{player}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}


function Navbar() {
  return (
    <div className="nav-main">
      <div className="title-container">
        <h2>Cards to Drink By</h2>
      </div>
      <div className="host-button-container">
        <button className="spectate-view">
          <span className="btn-text">Spectate</span>
          <span className="btn-icon"><img className="icon" src={glassesIcon}/></span>
        </button>
      </div>
    </div>
  );
}
