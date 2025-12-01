import React, { useState } from "react";
import axios from "axios";

export default function ResultPage() {
  const score = Number(sessionStorage.getItem("lastScore") || 0);
  const correct = Number(sessionStorage.getItem("lastCorrect") || 0);
  const total = Number(sessionStorage.getItem("lastTotal") || 0);
  const THRESHOLD = 60;

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  async function upload() {
    if (!file) {
      alert("Select a file");
      return;
    }
    const form = new FormData();
    form.append("resume", file);
    try {
      const res = await axios.post(
        "https://candidate-technical-assessment-system.onrender.com/api/upload-resume",
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.data.success) {
        setMessage("Resume uploaded successfully");
        setFile(null);
      } else setMessage("Upload failed");
    } catch (err) {
      console.error(err);
      setMessage("Upload error");
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-4">Result</h1>
      <p className="mb-4">
        Score: <strong>{score}%</strong> ({correct} / {total})
      </p>

      {score >= THRESHOLD ? (
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Congratulations — you passed!
          </h3>
          <p className="mb-2">Please upload your resume to proceed.</p>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-2"
          />
          <button
            onClick={upload}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mb-2"
          >
            Upload Resume
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Sorry — Try again later
          </h3>
          <p>Your score did not meet the threshold.</p>
        </div>
      )}
    </div>
  );
}
