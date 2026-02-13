import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registration from "./Registration";
import BugBingo from "./Game";
import Rules from "./Rules";
import BugBingo1 from "./Game1";
export default function App() {
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
