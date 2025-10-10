// server/index.js

const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./routes/index.js");
const calendarRoutes = require("./routes/calendar.js");

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(cors());
app.use(express.json());

// API 라우트
app.use("/api", routes);
app.use("/", calendarRoutes);

// health check
app.get("/healthz", (req, res) => {
  res.status(200).json({ ok: true });
});

// 정적 파일 제공
app.use(express.static(path.join(__dirname, "../public")));
app.use("/.well-known", express.static(path.join(__dirname, "../public/.well-known")));

app.get("/", (req, res) => {
  res.send("💗 Yuna Hub App is running successfully!");
});

module.exports = app;
