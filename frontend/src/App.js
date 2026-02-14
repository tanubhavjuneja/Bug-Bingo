import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registration from "./Registration";
import BugBingo from "./Game";
import Rules from "./Rules";
import BugBingo1 from "./Game1";

const API_URL = "https://bug-bingo-backend.onrender.com";

function AppContent() {
  useEffect(() => {
    // Ping backend on app startup to wake it up
    const pingBackend = async () => {
      try {
        const response = await fetch(`${API_URL}/ping`);
        if (response.ok) {
          console.log("Backend is awake!");
        }
      } catch (error) {
        console.log("Backend ping failed, will retry...");
        // Retry after 2 seconds
        setTimeout(pingBackend, 2000);
      }
    };
    
    pingBackend();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Rules />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/game" element={<BugBingo />} />
        <Route path="/game_final" element={<BugBingo1 />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return <AppContent />;
}
