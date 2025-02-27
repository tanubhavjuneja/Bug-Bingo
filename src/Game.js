import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
const Game = () => {
  const [questions, setQuestions] = useState([]);
  const [solved, setSolved] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [userCode, setUserCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(200); 
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(null);
  const navigate = useNavigate();
  const API_URL = "https://bug-bingo-backend.onrender.com";
  const userInformation = JSON.parse(localStorage.getItem("userInformation"));
  useEffect(() => {
    if (userInformation?.score) {
      setScore(userInformation.score);
    }
  }, []);
  useEffect(() => {
    if (!userInformation) {
      navigate("/");
      return;
    }
    if (score === null) {
      fetch(`${API_URL}/set_questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: userInformation.language.toLowerCase() })
      })
        .then((res) => res.ok ? res.json() : Promise.reject(`HTTP error! Status: ${res.status}`))
        .then((data) => {
          if (Array.isArray(data) && data.length >= 9) {
            setQuestions(data.slice(0, 9));
            setSolved(Array(9).fill(false));
          } else {
            console.error("Insufficient questions:", data);
          }
        })
        .catch((err) => console.error("Fetch error:", err));
    }
  }, [navigate, score]);
  useEffect(() => {
    if (gameOver || questions.length === 0 || score !== null) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [gameOver, questions, score]);
  useEffect(() => {
    if (timeLeft === 0) setGameOver(true);
  }, [timeLeft]);
  useEffect(() => {
    if (solved.length > 0 && solved.every((status) => status)) {
      setGameOver(true);
    }
  }, [solved]);
  useEffect(() => {
    if (gameOver && score === null) {
      const solvedCount = solved.filter(Boolean).length;
      const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6] 
      ];
      const completedLines = lines.filter(line => line.every(index => solved[index]));
      const totalScore = solvedCount + completedLines.length;
      setScore(totalScore);
      const updatedUserInformation = { 
        name: userInformation.name, 
        rollno: userInformation.rollno, 
        language: userInformation.language, 
        score: totalScore 
      };
      localStorage.setItem("userInformation", JSON.stringify(updatedUserInformation));
      fetch(`${API_URL}/submit_score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUserInformation)
      })
        .then(res => res.json())
        .then(data => console.log("Score submitted:", data))
        .catch(err => console.error("Error submitting score:", err));
    }
  }, [gameOver, solved, score, userInformation]);
  const handleCheck = () => {
    if (gameOver || currentIndex === null) return;
    const question = questions[currentIndex];
    fetch(`${API_URL}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: userCode.trim(),
        expected_output: question.expected_output.trim(),
        language: userInformation?.language.toLowerCase(),
      })
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.correct) {
          setSolved((prev) => {
            const newSolved = [...prev];
            newSolved[currentIndex] = true;
            return newSolved;
          });
          closePopup();
        } else {
          alert(result.message || "Incorrect output!");
        }
      })
      .catch((err) => console.error("Execution error:", err));
  };
  const openPopup = (index) => {
    setCurrentIndex(index);
    setUserCode(questions[index].problem);
  };
  const closePopup = () => {
    setCurrentIndex(null);
    setUserCode("");
  };
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };
  if (score !== null) {
    return (
      <div className="game-over">
        <h2>Game Over</h2>
        <p>Your Score: {score}</p>
        <p>Name: {userInformation.name}</p>
        <p>Roll No: {userInformation.rollno}</p>
        <p>Language: {userInformation.language}</p>
      </div>
    );
  }
  return (
    <div className="game-container">
      <h1 className="game-title">Bug Bingo - {userInformation?.language} Edition</h1>
      <div className="timer">Time Left: {formatTime(timeLeft)}</div>
      <div className="game-grid">
        {questions.map((question, index) => (
          <div
            key={index}
            className={`game-card ${solved[index] ? "solved" : ""}`}
            onClick={gameOver ? undefined : () => openPopup(index)}
          >
            {solved[index] ? "✔️" : index + 1}
          </div>
        ))}
      </div>
      {currentIndex !== null && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="close-btn" onClick={closePopup}>✖</button>
            <h2>Problem</h2>
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              className="popup-textarea"
            />
            <p>Expected Output: {questions[currentIndex].expected_output}</p>
            <button className="game-check-btn" onClick={handleCheck}>Check</button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Game;