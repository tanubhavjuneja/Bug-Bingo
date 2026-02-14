import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
const Game = () => {
  const [questions, setQuestions] = useState([]);
  const [solved, setSolved] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [userCode, setUserCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(1200);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(null);
  const navigate = useNavigate();
  const API_URL = "https://bug-bingo-backend.onrender.com";
  const userInformation = JSON.parse(localStorage.getItem("userInformation"));
  useEffect(() => {
    if (userInformation?.score !== undefined) {
      setScore(userInformation.score);
    }
  }, [userInformation?.score]);
  useEffect(() => {
    if (!userInformation) {
      navigate("/");
      return;
    }
    if (score === null) {
      fetch(`${API_URL}/set_questions1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: userInformation.language.toLowerCase() })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.questions?.length === 25) {   
            setQuestions(data.questions);
            setSolved(Array(25).fill(false));
          }
        })
        .catch((err) => console.error("Fetch error:", err));
    }
  }, [navigate, score, userInformation]);
  useEffect(() => {
    if (score !== null || gameOver || questions.length === 0) return;
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
        [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
        [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22],
        [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
        [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]
      ];
      const completedLines = lines.filter(line => line.every(index => solved[index]));
      const totalScore = solvedCount + completedLines.length;
      setScore(totalScore);
      const updatedUserInformation = { 
        ...userInformation,
        score: totalScore 
      };
      localStorage.setItem("userInformation", JSON.stringify(updatedUserInformation));
    }
  }, [gameOver, solved, score, userInformation]);
  const handleCheck = () => {
    if (gameOver || currentIndex === null) return;
    fetch(`${API_URL}/execute1`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: userInformation,
        code: userCode.trim(),
        test_cases: questions[currentIndex].test_cases,
        language: userInformation?.language.toLowerCase(),
      })
    })
      .then((res) => res.json())
      .then((result) => {
        if (Array.isArray(result)) {
            const passedCount = result.filter(test => test.correct).length;
            alert(`Test Cases Passed: ${passedCount}/${result.length}`);
            if (passedCount === result.length) {
                setSolved((prev) => {
                    const newSolved = [...prev];
                    newSolved[currentIndex] = true;
                    return newSolved;
                });
                closePopup();
            }
        } else if (result.message === "Cheating detected!") {
            alert("Cheating detected! Score -1");
            setScore((prev) => (prev > 0 ? prev - 1 : 0));
        } else if (result.message === "SQL injection detected!") {
            alert("SQL injection detected! Submission rejected. Score -1");
            setScore((prev) => (prev > 0 ? prev - 1 : 0));
        } else {
            alert(result.message || "Incorrect output!");
        }
    })
    .catch((err) => console.error("Execution error:", err));
  };
  const handleBackToRegistration = () => {
    localStorage.removeItem("userInformation");
    window.location.reload();
  };
  const openPopup = (index) => {
    setCurrentIndex(index);
    setUserCode(questions[index].function);
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
        <button className="back-to-registration" onClick={handleBackToRegistration}>
          Back to Registration
        </button>
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
            <h2>{questions[currentIndex].explanation}</h2>
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              className="popup-textarea"
            />
            <p>Test Case: {questions[currentIndex].test_cases[0].input}</p>
            <p>Expected Output: {questions[currentIndex].test_cases[0].expected_output}</p>
            <button className="game-check-btn" onClick={handleCheck}>Check</button>
          </div>
        </div>
      )}
      <button className="back-to-registration" onClick={handleBackToRegistration}>
        Back to Registration
      </button>
      <button 
        className="submit-score-btn" 
        onClick={() => setGameOver(true)}
        disabled={score !== null || gameOver}
      >
        Submit Score
      </button>
    </div>
  );
};
export default Game;