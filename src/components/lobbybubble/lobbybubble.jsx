function LobbyBubble({ players }) {
  return (
    <div className="bubble">
      <div className="bubble-header">
        <h3>Lobby</h3>
      </div>
      <div className="bubble-content">
        <ol className="player-list">
          {players.map((player, index) => ( <li key={index}>{player}</li>))}
        </ol>
      </div>
    </div>
  );
}
export default LobbyBubble;
