import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import "./style.css";

const API_URL = "https://bug-bingo-backend.onrender.com";

export default function Registration() {
  const [language, setLanguage] = useState("python");
  const navigate = useNavigate();

  useEffect(() => {
    wakeServer();
  }, []);

  const wakeServer = async () => {
    const url = `${API_URL}/ping`;
    const checkServer = () => {
      fetch(url, { method: "GET" })
        .then((response) => {
          if (response.ok) {
            console.log("Server is awake!");
          } else {
            setTimeout(checkServer, 1000);
          }
        })
        .catch(() => setTimeout(checkServer, 1000));
    };
    checkServer();
  };

  const goToGame = (gamePath) => {
    localStorage.setItem("userInformation", JSON.stringify({ language }));
    navigate(gamePath);
  };

  return (
    <div className="registration-container">
      <div className="registration-card registration-card-wide">
        <h1 className="registration-title">Bug Bingo</h1>

        <div className="rules-section">
          <div className="bug-bingo-card">
            <div className="bug-bingo-card-content">
              <p>
                Welcome to <strong>Bug Bingo</strong>! The game consists of a <strong>5x5 grid</strong> of coding problems.
                Each problem you solve earns you <strong>1 point</strong>.
              </p>
              <p>
                If you solve all five problems in a <strong>row</strong>, <strong>column</strong>, or <strong>diagonal</strong>,
                you earn an <strong>extra point</strong>!
              </p>
              <p>
                Users with a certain number of points will be <strong>shortlisted for the next round</strong>.
              </p>
            </div>
          </div>

          <div className="bug-bingo-alert">
            <AlertTriangle className="bug-bingo-alert-icon" />
            <div>
              <h2 className="bug-bingo-alert-title">Warning!</h2>
              <p>
                Attempting to print the expected output directly will be <strong>considered cheating</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="language-selection">
          <h3>Select Language:</h3>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="input-field"
          >
            <option value="python">Python</option>
            <option value="c++">C++</option>
          </select>
        </div>

        <div className="game-selection">
          <h3>Select Game Level:</h3>
          <button
            onClick={() => goToGame("/game")}
            className="submit-button game-btn"
          >
            Round 1
          </button>
          <button
            onClick={() => goToGame("/game_final")}
            className="submit-button game-btn"
          >
            Round 2
          </button>
        </div>
      </div>
    </div>
  );
}
