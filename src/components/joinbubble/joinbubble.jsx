import React, { useState} from "react";

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
export default JoinBubble;