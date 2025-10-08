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

// ✅ public 폴더 전체 정적 서빙 (특히 .well-known 접근용)
app.use(express.static(path.join(__dirname, "../public")));

// ✅ 미들웨어
app.use(cors());
app.use(express.json());

// ✅ 라우트 연결
app.use("/api", routes);

// ✅ 헬스체크
app.get("/healthz", (_req, res) => {
  res.json({ ok: true });
});

// ✅ ai-plugin.json 직접 매핑 (혹시 static이 안 잡힐 경우 대비)
app.get("/.well-known/ai-plugin.json", (_req, res) => {
  res.sendFile(path.join(__dirname, "../public/.well-known/ai-plugin.json"));
});

// ✅ 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
