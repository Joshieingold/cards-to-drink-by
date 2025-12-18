import "./pageCss/selectedPlayer.css";
import "./pageCss/general.css";
import { socket } from "../components/socket";

function SelectedPlayer({ currentCard, user }) {

  const { id: cardID, title: cardTitle, description: cardDesc } = currentCard;

  const SendNextRound = (choice) => {
    socket.emit("nextRound", { player: user, choice, cardID });
  };

  return (
    <div className="page-content">
      <div className="card-container">
        <div className="card">
          <div className="card-title">{cardTitle}</div>
          <div className="card-content">{cardDesc}</div>
          <div className="button-container">
            <button onClick={() => SendNextRound("drink")}>Drink</button>
            <button onClick={() => SendNextRound("truth")}>Truth</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectedPlayer;
