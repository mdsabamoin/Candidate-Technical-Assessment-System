import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function QuizPage({ selected }) {
  const nav = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState(() =>
    JSON.parse(sessionStorage.getItem("answers") || "{}")
  );
  const [loading, setLoading] = useState(true);

  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (!selected || selected.length === 0) {
      nav("/");
      return;
    }
    axios
      .get(
        "https://candidate-technical-assessment-system.onrender.com/api/questions"
      )
      .then((res) => {
        const all = res.data.filter((q) => selected.includes(q.language));
        setQuestions(shuffle(all));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [selected, nav]);

  useEffect(() => {
    sessionStorage.setItem("answers", JSON.stringify(answers));
  }, [answers]);

  function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }
  function selectOption(qid, optIdx) {
    setAnswers((prev) => ({ ...prev, [qid]: optIdx }));
  }
  function next() {
    if (index < questions.length - 1) {
      setIndex(index + 1);
      setTimer(60);
    }
  }
  function prev() {
    if (index > 0) {
      setIndex(index - 1);
      setTimer(60);
    }
  }

  function submit() {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) correct++;
    });
    const percent = Math.round((correct / questions.length) * 100);
    sessionStorage.setItem("lastScore", percent);
    sessionStorage.setItem("lastCorrect", correct);
    sessionStorage.setItem("lastTotal", questions.length);
    nav("/result");
  }

  useEffect(() => {
    if (loading || !questions.length) return;

    if (timer === 0) {
      if (index < questions.length - 1) {
        next();
      } else {
        submit();
      }
      return;
    }

    const t = setTimeout(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(t);
  }, [timer, index, loading, questions.length]);

  useEffect(() => {
    setTimer(60);
  }, [index]);

  if (loading)
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
        Loading...
      </div>
    );
  if (!questions.length)
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
        No questions available.
      </div>
    );

  const q = questions[index];
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Question {index + 1} / {questions.length}
        </h2>

        <div className="text-lg font-bold text-red-600">
          Time Left: {timer}s
        </div>
      </div>

      <div className="mb-4">{q.question}</div>
      <div className="flex flex-col gap-3 mb-4">
        {q.options.map((opt, i) => (
          <label
            key={i}
            className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer ${
              answers[q.id] === i
                ? "bg-blue-50 border-blue-400"
                : "border-gray-200"
            }`}
          >
            <input
              type="radio"
              name={`q-${q.id}`}
              checked={answers[q.id] === i}
              onChange={() => selectOption(q.id, i)}
            />
            {opt}
          </label>
        ))}
      </div>

      <div className="flex justify-between mb-4">
        <button
          onClick={prev}
          disabled={index === 0}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={next}
          disabled={index === questions.length - 1}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <button
        onClick={() => {
          if (window.confirm("Submit the test?")) submit();
        }}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Submit Test
      </button>
    </div>
  );
}
