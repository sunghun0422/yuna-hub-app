import express from "express";
import serverless from "serverless-http";
import path from "path";
import { fileURLToPath } from "url";

import healthRouter from "../server/routes/health.js";
import memoryRouter from "../server/routes/memory.js";
import storybookRouter from "../server/routes/storybook.js";
import gmailRouter from "../server/routes/gmail.js";
import calendarRouter from "../server/routes/calendar.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// ✅ 라우터 경로가 정확히 resolve 되게끔
app.use("/api/health", healthRouter);
app.use("/api/memory", memoryRouter);
app.use("/api/storybook", storybookRouter);
app.use("/api/gmail", gmailRouter);
app.use("/api/calendar", calendarRouter);

app.get("/", (req, res) => {
  res.json({ ok: true, message: "Yuna Hub 💖 root working" });
});

export const handler = serverless(app);
export default app;
