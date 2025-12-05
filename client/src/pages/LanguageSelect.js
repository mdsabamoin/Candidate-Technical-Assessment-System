import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LanguageSelect({ selected, setSelected }) {
  const navigate = useNavigate();
  const [languages, setLanguages] = useState([]);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    setStatus("pending");
    axios
      .get(
        "https://candidate-technical-assessment-system-01.onrender.com/api/questions"
      )
      .then((res) => {
        console.log("resss of languages", res);
        const langs = Array.from(new Set(res.data.map((q) => q.language)));
        setLanguages(langs);
        setStatus("fulfilled");
      })
      .catch((err) => {
        console.error(err);
        setStatus("rejected");
      });
  }, []);

  function toggle(lang) {
    if (selected.includes(lang))
      setSelected(selected.filter((l) => l !== lang));
    else setSelected([...selected, lang]);
  }

  function startTest() {
    if (selected.length === 0) {
      alert("Please select at least one language");
      return;
    }
    navigate("/quiz");
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-6">Choose languages</h1>

      {/* Loader added */}
      {status === "pending" && (
        <div className="w-full flex justify-center items-center mb-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <div> Render Initializing Please Wait ...</div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-6">
        {languages.map((lang) => (
          <label
            key={lang}
            className="bg-gray-100 px-4 py-2 rounded-lg cursor-pointer"
          >
            <input
              type="checkbox"
              className="mr-2"
              checked={selected.includes(lang)}
              onChange={() => toggle(lang)}
            />
            {lang}
          </label>
        ))}
      </div>

      <button
        onClick={startTest}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Start Test
      </button>
    </div>
  );
}
