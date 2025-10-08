// server/index.js
// 💡 Yuna Hub App main server file (Vercel-ready)

import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ 1. public 폴더 전체 정적 서빙
app.use(express.static(path.join(__dirname, "..", "public")));

// ✅ 2. 개별 경로 강제 지정 (404 방지)
app.get("/openapi.yaml", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "openapi.yaml"));
});

app.get("/.well-known/ai-plugin.json", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", ".well-known", "ai-plugin.json"));
});

// ✅ 3. 일반 미들웨어
app.use(cors());
app.use(express.json());

// ✅ 4. 내부 API 라우트 연결
app.use("/api", routes);

// ✅ 5. 헬스체크 엔드포인트
app.get("/healthz", (_req, res) => res.json({ ok: true }));

// ✅ 6. 서버 실행 (Vercel은 자동 포트 할당)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Yuna Hub server running on port ${PORT}`);
});
