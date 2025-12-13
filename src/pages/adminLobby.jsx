import Navbar from "../components/navbar/navbar";
import "./general.css";
import "./adminLobby.css";
function AdminLobby() {
  return (
    <div className="page-content">
      <Navbar />
      <div className="content-container">
        <div className="info-box-container">
          <div className="info-box">
            <div className="box-title">Join</div>
            <div className="box-content">
              <h3>Scan here to join</h3>
              <div className="qr-img-container">
                <img src=""></img>
              </div>
            </div>
          </div>

          <div className="info-box">
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
        </div>
      </div>
    </div>
  );}

export default AdminLobby;