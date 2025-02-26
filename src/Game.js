import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

const Game = () => {
  const [questions, setQuestions] = useState([]);
  const [solved, setSolved] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userCode, setUserCode] = useState("");
  const navigate = useNavigate();
  const API_URL = "https://tanubhavjuneja.pythonanywhere.com/bingo";
  const userInformation = JSON.parse(localStorage.getItem("userInformation"));
  useEffect(() => {
    if (!userInformation) {
      navigate("/");
      return;
    }
    fetch(`${API_URL}/set_questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "no-cors",
      body: JSON.stringify({ language: userInformation.language.toLowerCase() || "python" })
    })
      .then(res => res.ok ? res.json() : Promise.reject(`HTTP error! Status: ${res.status}`))
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setQuestions(data);
          setSolved(data.reduce((acc, q) => ({ ...acc, [q.id]: false }), {}));
        } else {
          console.error("Invalid data received:", data);
        }
      })
      .catch(err => console.error("Fetch error:", err));
  }, [navigate]);

  const handleCheck = () => {
    if (!currentQuestion) return;
    fetch(`${API_URL}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: userCode.trim(),
        expected_output: currentQuestion.expected_output.trim(),
        language: userInformation?.language.toLowerCase()
      })
    })
      .then(res => res.json())
      .then(result => {
        if (result.correct) {
          setSolved(prev => ({ ...prev, [currentQuestion.id]: true }));
          closePopup();
        } else {
          alert(result.message || "Incorrect output!");
        }
      })
      .catch(err => console.error("Execution error:", err));
  };

  const openPopup = (question) => {
    setCurrentQuestion(question);
    setUserCode(question.problem);
  };

  const closePopup = () => {
    setCurrentQuestion(null);
    setUserCode("");
  };

  const navigateQuestion = (direction) => {
    if (!currentQuestion) return;
    const currentIndex = questions.findIndex(q => q.id === currentQuestion.id);
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < questions.length) {
      openPopup(questions[newIndex]);
    }
  };

  return (
    <div className="game-container">
      <h1 className="game-title">Bug Bingo - {userInformation?.language} Edition</h1>
      <div className="game-grid">
        {questions.slice(0, 9).map((question, index) => (
          <div key={question.id} className={`game-card ${solved[question.id] ? "solved" : ""}`} onClick={() => openPopup(question)}>
            {solved[question.id] ? "✔️" : index + 1}
          </div>
        ))}
      </div>

      {currentQuestion && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="close-btn" onClick={closePopup}>✖</button>
            <h2>Problem</h2>
            <textarea value={userCode} onChange={(e) => setUserCode(e.target.value)} className="popup-textarea" />
            <p>Expected Output: {currentQuestion.expected_output}</p>
            <button className="game-check-btn" onClick={handleCheck}>Check</button>
            <div className="popup-nav">
              <button onClick={() => navigateQuestion(-1)}>Previous</button>
              <button onClick={() => navigateQuestion(1)}>Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
