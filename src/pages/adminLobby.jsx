import "./pageCss/general.css";
import "./pageCss/adminLobby.css";
import MiniCard from "../components/mini-card/miniCard";
import { socket } from "../components/socket";
function AdminLobby({ players }) {
  const startGame = () => {
      socket.emit("startGame");
  }
  return (
    <div className="page-content lobby-two">
      <div className="content-container lobby">
        <div className="box-container">
          <div className="info-box lobby-box">
            <div className="box-title">Join</div>
            <div className="box-content">
              <h3>Scan here to join</h3>
              <div className="qr-img-container">
                <img src="src/assets/qr-code.png" className="qr-img"></img>
              </div>
            </div>
          </div>

          <div className="info-box lobby-box">
            <div className="box-title">Lobby</div>
            <div className="box-content">
              <ul>
                {players.map((player) => (
                  <li key={player.id}>{player.name}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="info-box lobby-box">
            <div className="box-title">Controls</div>
            <div className="box-content">
              <button onClick={() => (startGame())}>Start Game</button>
            </div>
          </div>
        </div>
      </div>
      <h3>Cards</h3>
      <div className="card-scroll">
        <MiniCard title="Title" desc="This is the description" />
      </div>
    </div>
  );
}

export default AdminLobby;
