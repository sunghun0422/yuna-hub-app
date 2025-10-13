import express from "express";
import health from "./routes/health.js";

const app = express();

// 기본 라우트
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Yuna Hub 💗 root working" });
});

// 서브 라우트 연결
app.use("/api/health", health);

export default app;
