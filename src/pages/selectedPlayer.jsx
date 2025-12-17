import "./pageCss/selectedPlayer.css";
import "./pageCss/general.css";
function SelectedPlayer({currentCard}) {

  const { id: cardID, title: cardTitle, description: cardDesc, truth_count: truthCount, drink_count: drinkCount } = currentCard;
  return (
    <div className="page-content">
      <div className="card-container">
        <div className="card">
          <div className="card-title">{cardTitle}</div>
          <div className="card-content">{cardDesc}</div>
          <div className="button-container">
            <button>Drink</button>
            <button>Truth</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SelectedPlayer;
