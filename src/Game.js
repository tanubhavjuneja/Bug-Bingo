
import { useState } from "react";

export default function BugBingo() {
  const user = JSON.parse(localStorage.getItem("user"));
  const language = user?.language || "python";
  const problems = {
    python: ["Bug 1", "Bug 2", "Bug 3", "Bug 4", "Bug 5", "Bug 6", "Bug 7", "Bug 8", "Bug 9"],
    "c++": ["C++ Bug 1", "C++ Bug 2", "C++ Bug 3", "C++ Bug 4", "C++ Bug 5", "C++ Bug 6", "C++ Bug 7", "C++ Bug 8", "C++ Bug 9"]
  };

  const [solved, setSolved] = useState(Array(9).fill(false));
  const handleSolve = (index) => {
    const newSolved = [...solved];
    newSolved[index] = true;
    setSolved(newSolved);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Bug Bingo ({language})</h1>
      <div className="grid grid-cols-3 gap-2">
        {problems[language].map((bug, index) => (
          <div key={index} className={`p-4 text-center cursor-pointer border ${solved[index] ? "bg-green-400" : "bg-gray-200"}`} onClick={() => handleSolve(index)}>
            {bug}
          </div>
        ))}
      </div>
      <button className="mt-4 p-2 bg-blue-500 text-white" onClick={() => console.log("Submit Score")}>Submit</button>
    </div>
  );
}