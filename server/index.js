import express from "express";
import serverless from "serverless-http";
import healthRouter from "./routes/health.js";

const app = express();

// 라우터 연결
app.use("/api/health", healthRouter);

// 루트 경로 확인용
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Yuna Hub 💖 server root working" });
});

export const handler = serverless(app);
export default app;
