import Card from "../components/card/card";
import PlayerStats from "../components/player-stats/playerStats";
import "./pageCss/adminGame.css";

function AdminGame({ currentCard }) {
  if (!currentCard) {
    return <div>Loading card...</div>;
  }
  const { id: cardID, title: cardTitle, description: cardDesc, truth_count: truthCount, drink_count: drinkCount } = currentCard;

  return (
    <div className="page-content">
      <div className="card-section">
        <Card title={cardTitle} desc={cardDesc} />
      </div>

      <div className="details-container">
        <div className="stats-container">
          <div className="card-title">Round 1</div>
          <div className="bubble-content">
            <div>Most Drinks: Josh</div>
            <div>Most Answers: Edilyn</div>
          </div>
        </div>

        <div className="player-container">
          <PlayerStats currentDrinks={2} currentTruths={5} name={"Josh"} />
          <PlayerStats currentDrinks={2} currentTruths={5} name={"Edilyn"} />
          <PlayerStats currentDrinks={1} currentTruths={3} name={"Mike"} />
          <PlayerStats currentDrinks={0} currentTruths={4} name={"Anna"} />
        </div>
      </div>
    </div>
  );
}
export default AdminGame;
