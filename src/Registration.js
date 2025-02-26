// Registration.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Registration() {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [language, setLanguage] = useState("python");
  const navigate = useNavigate();

  const handleSubmit = () => {
    localStorage.setItem("user", JSON.stringify({ name, course, semester, language }));
    navigate("/game");
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Registration</h1>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="mb-2 p-2 border" />
      <input type="text" placeholder="Course" value={course} onChange={(e) => setCourse(e.target.value)} className="mb-2 p-2 border" />
      <input type="text" placeholder="Semester" value={semester} onChange={(e) => setSemester(e.target.value)} className="mb-2 p-2 border" />
      <select value={language} onChange={(e) => setLanguage(e.target.value)} className="mb-2 p-2 border">
        <option value="python">Python</option>
        <option value="c++">C++</option>
      </select>
      <button onClick={handleSubmit} className="p-2 bg-blue-500 text-white">Submit</button>
    </div>
  );
}