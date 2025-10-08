// server/index.js  (fixed)

import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";

// 경로 기준: 배포 런타임의 CWD 사용
const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.join(ROOT_DIR, "public");

const app = express();
const PORT = process.env.PORT || 3000;

// 정적 파일 (dotfiles 포함)
app.use(
  express.static(PUBLIC_DIR, {
    dotfiles: "allow",
  })
);

// ── 명시 라우트: .well-known/ai-plugin.json
app.get("/.well-known/ai-plugin.json", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, ".well-known", "ai-plugin.json"));
});

// ── 명시 라우트: openapi.yaml (콘텐츠 타입 보장)
app.get("/openapi.yaml", (req, res) => {
  res.type("text/yaml");
  res.sendFile(path.join(PUBLIC_DIR, "openapi.yaml"));
});

// API 미들웨어
app.use(cors());
app.use(express.json());
app.use("/api", routes);

// 루트/헬스
app.get("/", (_req, res) => {
  res.send("🌙 Yuna Hub App is running successfully!");
});
app.get("/healthz", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
