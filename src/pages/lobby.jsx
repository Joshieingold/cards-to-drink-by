import { useEffect, useState } from "react";
import Navbar from "../components/navbar/navbar";
import "./general.css";

function Lobby() {
  const [isMobile, setIsMobile] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    setIsMobile(media.matches);

    const listener = (e) => setIsMobile(e.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, []);

  return (
    <div className="page-content">
      <div className="content-container">
        <div className="info-box-container">
          <div className="info-box">
            <div className="box-title">Join</div>
            <div className="box-content">
              <h3>What is your name?</h3>
              <input className="text-box" />
              <button>Join</button>
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

        {/* Desktop form */}
        {!isMobile && (
          <div className="add-card-form">
            <div className="form-title">Add a Card to the Game!</div>

            <div className="box-content">
              <div className="form-text-container">
                <h2>Category:</h2>
                <input className="text-box" />
              </div>

              <div className="form-text-container">
                <h2>Question:</h2>
                <textarea className="text-box area"></textarea>
              </div>

              <button>Submit</button>
            </div>
          </div>
        )}

        {/* Mobile toggle button */}
        {isMobile && (
          <button
            className="add-card-toggle"
            onClick={() => setShowAddCard(true)}
          >
            Add Card
          </button>
        )}

        {/* Mobile popover */}
        {isMobile && showAddCard && (
          <div
            className="add-card-popover"
            onClick={() => setShowAddCard(false)}
          >
            <div
              className="add-card-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="form-title">
                Add a Card to the Game!
                <button
                  className="close-btn"
                  onClick={() => setShowAddCard(false)}
                >
                  ✕
                </button>
              </div>

              <div className="box-content">
                <div className="form-text-container">
                  <h2>Category:</h2>
                  <input className="text-box" />
                </div>

                <div className="form-text-container">
                  <h2>Question:</h2>
                  <textarea className="text-box area"></textarea>
                </div>

                <button>Submit</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Lobby;
