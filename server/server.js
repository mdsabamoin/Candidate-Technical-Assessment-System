require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();
// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "https://candidate-technical-assessment-syst-eosin.vercel.app/",
//     ],
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.use(express.static(path.join(__dirname, "client/build")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

const QUESTIONS_PATH = path.join(__dirname, "questions.json");
const progressStore = {};

const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ts = Date.now();
    const safe = file.originalname.replace(/[^a-zA-Z0-9.\-]/g, "_");
    cb(null, `${ts}_${safe}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

app.get("/api/questions", (req, res) => {
  fs.readFile(QUESTIONS_PATH, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Could not load questions" });
    res.json(JSON.parse(data));
  });
});

app.post("/api/save-progress", (req, res) => {
  const { sessionId, data } = req.body;
  if (!sessionId) return res.status(400).json({ error: "sessionId required" });

  progressStore[sessionId] = data;
  res.json({ ok: true });
});

app.get("/api/load-progress/:sessionId", (req, res) => {
  const id = req.params.sessionId;
  res.json(progressStore[id] || null);
});

app.post("/api/upload-resume", upload.single("resume"), (req, res) => {
  if (!req.file)
    return res.status(400).json({ success: false, error: "File required" });

  res.json({
    success: true,
    path: `/uploads/${req.file.filename}`,
  });
});

app.use("/uploads", express.static(UPLOAD_DIR));

const port = process.env.PORT || 4000;

app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
