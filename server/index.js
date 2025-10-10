// server/index.js
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(cors());
app.use(express.json());

// API 라우트
app.use("/api", routes);

// ✅ healthz 엔드포인트 추가
app.get("/healthz", (req, res) => {
  res.status(200).json({ ok: true });
});

// ✅ public 폴더를 정적으로 오픈
app.use(express.static(path.join(__dirname, "../public")));

// ✅ .well-known 폴더도 별도로 오픈
app.use("/.well-known", express.static(path.join(__dirname, "../public/.well-known")));

// 루트 페이지 확인용
app.get("/", (req, res) => {
  res.send("💗 Yuna Hub App is running successfully!");
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
