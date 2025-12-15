import "./playerStats.css"
function PlayerStats({ name, currentDrinks, currentTruths }) {
  const total = currentDrinks + currentTruths;
  const drinksPercent = total ? (currentDrinks / total) * 100 : 0;
  const truthsPercent = total ? (currentTruths / total) * 100 : 0;

  return (
    <div className="player-card">
      <div className="player-card-title">{name}</div>

      <div className="stat-bar">
        <div
          className="bar drinks"
          style={{ width: `${drinksPercent}%` }}
        >
          {currentDrinks}
        </div>
        <div
          className="bar truths"
          style={{ width: `${truthsPercent}%` }}
        >
          {currentTruths}
        </div>
      </div>

    </div>
  );
}
export default PlayerStats
