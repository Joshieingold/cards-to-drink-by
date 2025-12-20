import Card from "../components/card/card";
import PlayerStats from "../components/player-stats/playerStats";
import "./pageCss/adminGame.css";

function AdminGame({ currentCard, playerStats, round, chosenUser}) {

  if (!currentCard) { // Handles waiting for the server to get a card
    return <div>Loading card</div>;
  }
  const { title: cardTitle, description: cardDesc} = currentCard; // Maps the current cards data to variables.
  const playersArray = Object.entries(playerStats || {}).map( ([name, stats]) => ({ name, drinks: stats.drink, truths: stats.truth})); // Gets an array of the players for use in the stats cards.
  const mostDrinks = playersArray.reduce((a, b) => b.drinks > a.drinks ? b : a).name;
  const mostTruths = playersArray.reduce((a, b) => b.truths > a.truths ? b : a).name;

  return (
    <div className="page-content">
      <div className="card-section">
        <Card title={cardTitle} desc={cardDesc} />
      </div>
      <div className="details-container">
        <div className="stats-container">
          <div className="card-title">Current Round {round}</div>
          <div className="bubble-content">
                <h3>Chosen Player: {chosenUser}</h3>
            {playersArray.length > 0 && (
              <>
                <div>
                  Most Drinks: { mostDrinks }
                </div>
                <div>
                  Most Truths: { mostTruths }
                </div>
              </>
            )}
          </div>
        </div>
        <div className="player-container">
          {playersArray.map((player) => (<PlayerStats key={player.name} name={player.name} currentDrinks={player.drinks} currentTruths={player.truths}/>))}
        </div>
      </div>
    </div>
  );
}

export default AdminGame;
