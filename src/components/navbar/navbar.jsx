import glassesIcon from "../../assets/glasses.png";

function Navbar({setGameState}) {
  return (
    <div className="nav-main">
      <div className="title-container">
        <h2>Cards to Drink By</h2>
      </div>
      <div className="host-button-container">
        <button className="spectate-view" onClick={() => setGameState("countdown")}>
          <span className="btn-text">Spectate</span>
          <span className="btn-icon"><img className="icon" src={glassesIcon}/></span>
        </button>
      </div>
    </div>
  );
}
export default Navbar;