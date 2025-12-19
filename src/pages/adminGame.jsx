import Card from "../components/card/card";
import PlayerStats from "../components/player-stats/playerStats";
import "./pageCss/adminGame.css";

function AdminGame({ currentCard, playerStats, round, chosenUser}) {
  if (!currentCard) {
    return <div>Loading card...</div>;
  }

  const {
    title: cardTitle,
    description: cardDesc,
  } = currentCard;

  // Convert map → array
  const playersArray = Object.entries(playerStats || {}).map(
    ([name, stats]) => ({
      name,
      drinks: stats.drink,
      truths: stats.truth,
    })
  );

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
                  Most Drinks:{" "}
                  {
                    playersArray.reduce((a, b) =>
                      b.drinks > a.drinks ? b : a
                    ).name
                  }
                </div>
                <div>
                  Most Truths:{" "}
                  {
                    playersArray.reduce((a, b) =>
                      b.truths > a.truths ? b : a
                    ).name
                  }
                </div>
              </>
            )}
          </div>
        </div>

        <div className="player-container">
          {playersArray.map((player) => (
            <PlayerStats
              key={player.name}
              name={player.name}
              currentDrinks={player.drinks}
              currentTruths={player.truths}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminGame;
