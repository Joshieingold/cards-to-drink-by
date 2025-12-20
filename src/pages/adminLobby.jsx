import "./pageCss/general.css";
import "./pageCss/adminLobby.css"
import MiniCard from "../components/mini-card/miniCard";
function AdminLobby() {
  return (
    <div className="page-content lobby-two">
      <div className="content-container lobby">
        <div className="box-container">
          <div className="info-box lobby-box">
            <div className="box-title">Join</div>
            <div className="box-content">
              <h3>Scan here to join</h3>
              <div className="qr-img-container">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYwP2GpBa2-ABQAXqI3HAE1ed72FpfAv17YA&s" className="qr-img"></img>
              </div>
            </div>
          </div>

          <div className="info-box lobby-box">
            <div className="box-title">Lobby</div>
            <div className="box-content">
              <ul>
                <li>Player Name goes here</li>
                <li>Player Name goes here</li>
                <li>Player Name goes here</li>
                <li>Player Name goes here</li>
                <li>Player Name goes here</li>
                <li>Player Name goes here</li>
              </ul>
            </div>
          </div>
          <div className="info-box lobby-box">
            <div className="box-title">Controls</div>
            <div className="box-content">
              <button>Start Game</button>
            </div>
          </div>
        </div>
      </div>
      <h3>Cards</h3>
      <div className="card-scroll">
        <MiniCard title="Title" desc="This is the description"/>
      </div>
    </div>
  );}

export default AdminLobby;