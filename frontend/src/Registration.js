import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

const API_URL = "https://bug-bingo-backend.onrender.com";

export default function Registration() {
  const [name, setName] = useState("");
  const [rollno, setRollNo] = useState("");
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
    if (!name || !rollno) {
      alert("Please enter your name and roll number first!");
      return;
    }
    localStorage.setItem("userInformation", JSON.stringify({ name, rollno, language }));
    navigate(gamePath);
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <h1 className="registration-title">Register</h1>
        <input 
          type="text" 
          placeholder="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="input-field" 
        />
        <input 
          type="text" 
          placeholder="Roll No" 
          value={rollno} 
          onChange={(e) => setRollNo(e.target.value)} 
          className="input-field" 
        />
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)} 
          className="input-field"
        >
          <option value="python">Python</option>
          <option value="c++">C++</option>
        </select>
        
        <div className="game-selection">
          <h3>Select Game Round:</h3>
          <button 
            onClick={() => goToGame("/game")} 
            className="submit-button game-btn"
          >
            Preliminary Round
          </button>
          <button 
            onClick={() => goToGame("/game_final")} 
            className="submit-button game-btn"
          >
            Final Round
          </button>
        </div>
      </div>
    </div>
  );
}
