import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import LanguageSelect from "./pages/LanguageSelect";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";

export default function App() {
  const [selectedLanguages, setSelectedLanguages] = useState(() => {
    const raw = sessionStorage.getItem("selectedLanguages");
    return raw ? JSON.parse(raw) : [];
  });

  useEffect(() => {
    sessionStorage.setItem(
      "selectedLanguages",
      JSON.stringify(selectedLanguages)
    );
  }, [selectedLanguages]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LanguageSelect
            selected={selectedLanguages}
            setSelected={setSelectedLanguages}
          />
        }
      />
      <Route path="/quiz" element={<QuizPage selected={selectedLanguages} />} />
      <Route path="/result" element={<ResultPage />} />
    </Routes>
  );
}
