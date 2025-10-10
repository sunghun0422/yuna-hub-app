// server/index.js
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import calendarRoutes from "./routes/calendar.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ 미들웨어
app.use(cors());
app.use(express.json());

// ✅ API 라우트 (/api 경로용)
app.use("/api", routes);

// ✅ GPT 액션용: 루트 경로에서도 calendar-daily 사용 가능하게 등록
app.use("/", calendarRoutes);

// ✅ healthz 엔드포인트
app.get("/healthz", (req, res) => {
  res.status(200).json({ ok: true });
});

// ✅ public 폴더 정적 제공
app.use(express.static(path.join(__dirname, "../public")));

// ✅ .well-known 폴더 정적 제공
app.use("/.well-known", express.static(path.join(__dirname, "../public/.well-known")));

// ✅ 루트 페이지
app.get("/", (req, res) => {
  res.send("💗 Yuna Hub App is running successfully!");
});

// ✅ 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
