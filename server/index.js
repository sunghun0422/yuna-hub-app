import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import healthRouter from "./routes/health.js";
import memoryRouter from "./routes/memory.js";
import storybookRouter from "./routes/storybook.js";
import gmailRouter from "./routes/gmail.js";
import calendarRouter from "./routes/calendar.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 기본 루트
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Yuna Hub 💗 root running" });
});

// 라우트 연결
app.use("/api/health", healthRouter);
app.use("/api/memory", memoryRouter);
app.use("/api/storybook", storybookRouter);
app.use("/api/gmail", gmailRouter);
app.use("/api/calendar", calendarRouter);

// 기본 에러 처리
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ ok: false, message: "Internal Server Error" });
});

export default app;
