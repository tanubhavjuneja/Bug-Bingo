import { AlertTriangle } from "lucide-react";
import "./style.css";
export default function BugBingoRules() {
  return (
    <div className="bug-bingo-container">
      <h1 className="bug-bingo-heading">Bug Bingo Rules</h1>
      <div className="bug-bingo-card">
        <div className="bug-bingo-card-content">
          <p>
            Welcome to <strong>Bug Bingo</strong>! The game consists of a <strong>3x3 grid</strong> of coding problems.
            Each problem you solve earns you <strong>1 point</strong>.
          </p>
          <p>
            If you solve all three problems in a <strong>row</strong>, <strong>column</strong>, or <strong>diagonal</strong>,
            you earn an <strong>extra point</strong>!
          </p>
          <p>
            Users with a certain number of points will be <strong>shortlisted for the next round</strong>.
          </p>
        </div>
      </div>
      <div className="bug-bingo-alert">
        <AlertTriangle className="bug-bingo-alert-icon" />
        <div>
          <h2 className="bug-bingo-alert-title">Warning!</h2>
          <p>
            Attempting to print the expected output directly will be <strong>considered cheating</strong>.
          </p>
        </div>
      </div>
      <div className="bug-bingo-button-container">
        <button className="bug-bingo-button" onClick={() => window.location.href='/registration'}>
          Go to Registration
        </button>
      </div>
    </div>
  );
}