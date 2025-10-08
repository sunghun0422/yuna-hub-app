// server/index.js

import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";

// ✅ 경로 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ public 폴더를 정적으로 오픈 (dotfiles 포함)
const PUBLIC_DIR = path.join(__dirname, "..", "public");
app.use(
  express.static(PUBLIC_DIR, {
    dotfiles: "allow", // .well-known 같은 폴더 접근 허용
  })
);

// ✅ 백업용 수동 라우트 (.well-known 대응)
app.get("/.well-known/ai-plugin.json", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, ".well-known", "ai-plugin.json"));
});

// ✅ API 미들웨어
app.use(cors());
app.use(express.json());
app.use("/api", routes);

// ✅ 기본 루트
app.get("/", (req, res) => {
  res.send("🌙 Yuna Hub App is running successfully!");
});

// ✅ 헬스체크
app.get("/healthz", (req, res) => {
  res.json({ ok: true });
});

// ✅ 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
