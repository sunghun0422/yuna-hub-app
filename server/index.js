import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 기본 헬스체크
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok", message: "Yuna Hub Server running fine 💖" });
});

// 라우터들 불러오기
import memoryRoutes from "./routes/Memory.js";
import storybookRoutes from "./routes/Storybook.js";
import gmailRoutes from "./routes/gmail.js";
import calendarRoutes from "./routes/calendar.js";

app.use("/api/memory", memoryRoutes);
app.use("/api/storybook", storybookRoutes);
app.use("/api/gmail", gmailRoutes);
app.use("/api/calendar", calendarRoutes);

export default app;
