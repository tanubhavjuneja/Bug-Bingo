import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registration from "./Registration";
import BugBingo from "./Game";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/game" element={<BugBingo />} />
      </Routes>
    </Router>
  );
}
