import Navbar from "../components/navbar/navbar";
import "./general.css";
import "./adminLobby.css";
import MiniCard from "../components/mini-card/miniCard";
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
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYwP2GpBa2-ABQAXqI3HAE1ed72FpfAv17YA&s" className="qr-img"></img>
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
      <h3>Cards</h3>
      <div className="card-scroll">
        <MiniCard title="Title" desc="This is the description"/>
      </div>
    </div>
  );}

export default AdminLobby;