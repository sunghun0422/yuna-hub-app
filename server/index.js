import express from "express";
import cors from "cors";
import memoryRoute from "./routes/memory.js";
import storybookRoute from "./routes/storybook.js";
import gmailRoute from "./routes/gmail.js";
import calendarRoute from "./routes/calendar.js";

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Health check route (제일 위에 위치)
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Yuna Hub 💗 health check passed" });
});

// ✅ 개별 라우트 등록
app.use("/api", memoryRoute);
app.use("/api", storybookRoute);
app.use("/api", gmailRoute);
app.use("/api", calendarRoute);

export default app;
