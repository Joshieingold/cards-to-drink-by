import "./pageCss/general.css";
import "./pageCss/adminLobby.css";
import MiniCard from "../components/mini-card/miniCard";
import { socket } from "../components/socket";
import { useEffect, useState } from "react";

function AdminLobby({ players }) {
  const [cards, setCards] = useState([]);

  const startGame = () => { // Pings the server to begin the game
    socket.emit("startGame");
  };

  useEffect(() => { // Request five cards from the server
    socket.emit("requestFiveCards");

    // Listen for the server response
    const handleFiveCards = (cardsFromServer) => {
      setCards(cardsFromServer);
    };

    socket.on("fiveCards", handleFiveCards);

    return () => {
      socket.off("fiveCards", handleFiveCards);
    };
  }, []);

  return (
    <div className="page-content lobby-two">
      <div className="content-container lobby">
        <div className="box-container">
          <div className="info-box lobby-box">
            <div className="box-title">Join</div>
            <div className="box-content">
              <h3>Scan here to join</h3>
              <div className="qr-img-container">
                <img
                  src="src/assets/qr-code.png"
                  className="qr-img"
                  alt="QR Code"
                />
              </div>
            </div>
          </div>
          <div className="info-box lobby-box">
            <div className="box-title">Lobby</div>
            <div className="box-content">
              <ul>
                {players.map((player) => ( <li key={player.id}>{player.name}</li>))}
              </ul>
            </div>
          </div>
          <div className="info-box lobby-box">
            <div className="box-title">Controls</div>
            <div className="box-content">
              <button onClick={startGame}>Start Game</button>
            </div>
          </div>
        </div>
      </div>
      <div className="card-scroll">
        {cards.length === 0 ? (
          <p>Loading cards...</p>
        ) : (
          cards.map((card) => (
            <MiniCard key={card.id} title={card.title} desc={card.desc} />
          ))
        )}
      </div>
    </div>
  );
}

export default AdminLobby;
