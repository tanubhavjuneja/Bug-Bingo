import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Registration from "./Registration";
import BugBingo from "./Game";
import BugBingo1 from "./Game1";

const API_URL = "https://bug-bingo-backend.onrender.com";

function AppContent() {
  useEffect(() => {
    const pingBackend = async () => {
      try {
        const response = await fetch(`${API_URL}/ping`);
        if (response.ok) {
          console.log("Backend is awake!");
        }
      } catch (error) {
        console.log("Backend ping failed, will retry...");
        setTimeout(pingBackend, 2000);
      }
    };
    
    pingBackend();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/registration" element={<Navigate to="/" replace />} />
        <Route path="/game" element={<BugBingo />} />
        <Route path="/game_final" element={<BugBingo1 />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return <AppContent />;
}
