import express from "express";
import serverless from "serverless-http";

import healthRouter from "../server/routes/health.js";
import memoryRouter from "../server/routes/memory.js";
import storybookRouter from "../server/routes/storybook.js";
import gmailRouter from "../server/routes/gmail.js";
import calendarRouter from "../server/routes/calendar.js";

const app = express();
app.use(express.json());

// Router 연결
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
