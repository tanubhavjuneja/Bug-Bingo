import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registration from "./Registration";
import BugBingo from "./Game";
import BugBingo1 from "./Game1";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/game" element={<BugBingo />} />
        <Route path="/game_final" element={<BugBingo1 />} />
        </Routes>
    </Router>
  );
}
