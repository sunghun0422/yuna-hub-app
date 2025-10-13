import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/healthz", (req, res) => {
  res.status(200).json({ ok: true, message: "Yuna Hub 💖 running smoothly" });
});

// ✅ 라우터 연결 (없으면 주석처리 가능)
try {
  const memoryRoutes = await import("./routes/Memory.js");
  const storybookRoutes = await import("./routes/Storybook.js");
  const gmailRoutes = await import("./routes/gmail.js");
  const calendarRoutes = await import("./routes/calendar.js");

  app.use("/api/memory", memoryRoutes.default);
  app.use("/api/storybook", storybookRoutes.default);
  app.use("/api/gmail", gmailRoutes.default);
  app.use("/api/calendar", calendarRoutes.default);
} catch (e) {
  console.log("⚠️ Route load skipped (development mode)");
}

export default app;
