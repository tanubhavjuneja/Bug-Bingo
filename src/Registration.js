import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
export default function Registration() {
  const [name, setName] = useState("");
  const [rollno, setRollNo] = useState("");
  const [language, setLanguage] = useState("python");
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("userInformation")) {
      navigate("/game");
    }
  }, [navigate]);
  const handleSubmit = () => {
    localStorage.setItem("userInformation", JSON.stringify({ name, rollno, language }));
    navigate("/game");
  };
  return (
    <div className="registration-container">
      <div className="registration-card">
        <h1 className="registration-title">Register</h1>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
        <input type="text" placeholder="Roll No" value={rollno} onChange={(e) => setRollNo(e.target.value)} className="input-field" />
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input-field">
          <option value="python">Python</option>
          <option value="c++">C++</option>
        </select>
        <button onClick={handleSubmit} className="submit-button">Submit</button>
      </div>
    </div>
  );
}