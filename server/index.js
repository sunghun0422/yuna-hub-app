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

// ✅ 라우터 연결
app.use("/api/health", healthRouter);
app.use("/api/memory", memoryRouter);
app.use("/api/storybook", storybookRouter);
app.use("/api/gmail", gmailRouter);
app.use("/api/calendar", calendarRouter);

// ✅ 기본 root 확인용
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Yuna Hub 💗 root working" });
});

export default app;
