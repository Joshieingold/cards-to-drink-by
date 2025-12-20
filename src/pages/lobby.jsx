import { useEffect, useState } from "react";
import { socket } from "../components/socket"; // make sure this path is correct
import "../pages/pageCss/general.css";

function Lobby({ callbackFunction, players }) {
  const [isMobile, setIsMobile] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [username, setUsername] = useState("");
  const [cardTitle, setCardTitle] = useState("");
  const [cardQuestion, setCardQuestion] = useState("");

  useEffect(() => { // Finds user screen size and changes the layout accordingly
    const media = window.matchMedia("(max-width: 768px)");
    setIsMobile(media.matches);
    const listener = (e) => setIsMobile(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const submitCard = () => { // Sends a card to the server to add.
    if (!cardTitle.trim() || !cardQuestion.trim()) return;
    socket.emit("createCardRequest", { title: cardTitle, description: cardQuestion, creator: username });
    setCardTitle("");
    setCardQuestion("");
    setShowAddCard(false);
  };

  return (
    <div className="page-content">
      <div className="content-container">
        <div className="info-box-container">
          <div className="info-box">
            <div className="box-title">Join</div>
            <div className="box-content">
              <h3>What is your name?</h3>
              <input className="text-box" value={username} onChange={(e) => setUsername(e.target.value)} />
              <button onClick={() => callbackFunction(username)} disabled={!username.trim()}>Join</button>
            </div>
          </div>
          <div className="info-box">
            <div className="box-title">Lobby</div>
            <div className="box-content">
              <ul>
                {players.map((player) => (
                  <li key={player.id}>{player.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Desktop */}
        {!isMobile && (
          <div className="add-card-form">
            <div className="form-title">Add a Card to the Game!</div>
            <div className="box-content">
              <div className="form-text-container">
                <h2>Title:</h2>
                <input className="text-box" value={cardTitle} onChange={(e) => setCardTitle(e.target.value)}/>
              </div>
              <div className="form-text-container">
                <h2>Question:</h2>
                <textarea className="text-box area" value={cardQuestion} onChange={(e) => setCardQuestion(e.target.value)}/>
              </div>
              <button onClick={submitCard}>Submit</button>
            </div>
          </div>
        )}

        {/* Mobile */}
        {isMobile && (
          <button className="add-card-toggle" onClick={() => setShowAddCard(true)}>Add Card</button>
        )}

        {/* Mobile Popover */}
        {isMobile && showAddCard && (
          <div className="add-card-popover" onClick={() => setShowAddCard(false)}>
            <div className="add-card-modal" onClick={(e) => e.stopPropagation()}>
              <div className="form-title">
                Add a Card to the Game!
                <button className="close-btn" onClick={() => setShowAddCard(false)}>✕</button>
              </div>
              <div className="box-content">
                <div className="form-text-container">
                  <h2>Title:</h2>
                  <input className="text-box" value={cardTitle} onChange={(e) => setCardTitle(e.target.value)}/>
                </div>
                <div className="form-text-container">
                  <h2>Question:</h2>
                  <textarea className="text-box area" value={cardQuestion} onChange={(e) => setCardQuestion(e.target.value)}/>
                </div>
                <button onClick={submitCard}>Submit</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Lobby;
