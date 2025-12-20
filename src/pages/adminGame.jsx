import Card from "../components/card/card"
import PlayerStats from "../components/player-stats/playerStats";
import "./pageCss/adminGame.css"
function AdminGame() {
    return (
      <div className="page-content">
        <div className="card-section">
          <Card title={"New Title"} desc={"This is the new desc"} />
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
              <PlayerStats currentDrinks={2} currentTruths={5} name={"Josh"}></PlayerStats>
              <PlayerStats currentDrinks={2} currentTruths={5} name={"Josh"}></PlayerStats>
              <PlayerStats currentDrinks={2} currentTruths={5} name={"Josh"}></PlayerStats>
              <PlayerStats currentDrinks={2} currentTruths={5} name={"Josh"}></PlayerStats>
              <PlayerStats currentDrinks={2} currentTruths={5} name={"Josh"}></PlayerStats>
              <PlayerStats currentDrinks={2} currentTruths={5} name={"Josh"}></PlayerStats>
              <PlayerStats currentDrinks={2} currentTruths={5} name={"Josh"}></PlayerStats>
          </div>
        </div>
      </div>
    );
}
export default AdminGame