import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

const Game = () => {
  const [questions, setQuestions] = useState([]);
  const [solved, setSolved] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [userCode, setUserCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(300);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(null);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = "https://bug-bingo-backend.onrender.com";

  // Load questions only once on mount
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInformation"));
    
    if (!userInfo) {
      navigate("/registration");
      return;
    }
    
    let isMounted = true;
    
    fetch(`${API_URL}/set_questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: userInfo.language.toLowerCase() })
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length >= 25) {
          setQuestions(data.slice(0, 25));
          setSolved(Array(25).fill(false));
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        if (isMounted) setIsLoading(false);
      });
      
    return () => { isMounted = false; };
  }, []); // Empty dependency array - only run once

  useEffect(() => {
    if (gameOver || questions.length === 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [gameOver, questions]);

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
    }
  }, [gameOver, solved, score]);

  const submitScoreToDatabase = useCallback(async (finalScore) => {
    const userInfo = JSON.parse(localStorage.getItem("userInformation"));
    if (!userInfo) return;
    
    try {
      const response = await fetch(`${API_URL}/submit_score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userInfo.name,
          rollno: userInfo.rollno,
          score: finalScore,
          round: "preliminary"
        })
      });
      
      if (response.ok) {
        console.log("Score submitted successfully");
        setScoreSubmitted(true);
      } else {
        console.error("Failed to submit score");
      }
    } catch (error) {
      console.error("Error submitting score:", error);
    }
  }, [API_URL]);

  // Submit score to database when game ends
  useEffect(() => {
    if (score !== null && !scoreSubmitted) {
      submitScoreToDatabase(score);
    }
  }, [score, scoreSubmitted, submitScoreToDatabase]);

  const handleCheck = () => {
    if (gameOver || currentIndex === null) return;
  
    const question = questions[currentIndex];
    const userInfo = JSON.parse(localStorage.getItem("userInformation"));
    
    fetch(`${API_URL}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: userCode.trim(),
        expected_output: question.expected_output.trim(),
        language: userInfo?.language.toLowerCase(),
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
        } else if (result.message === "Cheating detected!") {
          alert("Cheating detected!");
        } else {
          alert(result.message || "Incorrect output!");
        }
      })
      .catch((err) => console.error("Execution error:", err));
  };  

  const handleBackToRegistration = () => {
    navigate("/registration");
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

  if (isLoading) {
    return (
      <div className="game-container">
        <h1 className="game-title">Loading...</h1>
      </div>
    );
  }

  if (score !== null) {
    const userInfo = JSON.parse(localStorage.getItem("userInformation"));
    return (
      <div className="game-over">
        <h2>Game Over</h2>
        <p>Your Score: {score}</p>
        <p>Name: {userInfo?.name}</p>
        <p>Roll No: {userInfo?.rollno}</p>
        <p>Language: {userInfo?.language}</p>
        <button className="back-to-registration" onClick={handleBackToRegistration}>
          Back to Registration
        </button>
      </div>
    );
  }

  return (
    <div className="game-container">
      <h1 className="game-title">Bug Bingo - {JSON.parse(localStorage.getItem("userInformation"))?.language} Edition (Preliminary Round)</h1>
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
      <button className="back-to-registration" onClick={handleBackToRegistration}>
        Back to Registration
      </button>
      <button 
        className="submit-score-btn" 
        onClick={() => setGameOver(true)}
        disabled={gameOver}
      >
        Submit Score
      </button>
    </div>
  );
};

export default Game;
