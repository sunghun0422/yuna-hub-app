const express = require("express");
const cors = require("cors");
const path = require("path");

const routes = require("./routes"); // /server/routes/index.js 를 불러옴

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API 라우트 연결
app.use("/api", routes);

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, "../public")));
app.use("/.well-known", express.static(path.join(__dirname, "../public/.well-known")));

// 헬스체크
app.get("/healthz", (req, res) => {
  res.status(200).json({ ok: true });
});

app.get("/", (req, res) => {
  res.send("Yuna Hub App is running!");
});

module.exports = app;
