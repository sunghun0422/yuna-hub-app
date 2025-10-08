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
// server/index.js  (기존 내용 유지하고, 아래 2개 라우트 추가)

import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 정적 파일 폴더(안전망)
app.use(express.static(path.join(__dirname, "..", "public")));

// ✅ 명시적 라우트: OpenAPI 스펙
app.get("/openapi.yaml", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "openapi.yaml"));
});

// ✅ 명시적 라우트: 플러그인 매니페스트
app.get("/.well-known/ai-plugin.json", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", ".well-known", "ai-plugin.json"));
});

app.use(cors());
app.use(express.json());

// API 라우트
app.use("/api", routes);

app.get("/healthz", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});
