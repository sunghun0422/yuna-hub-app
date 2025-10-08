// server/index.js  (Vercel serverless handler 버전)

import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";

// 런타임 기준 경로 (안전)
const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.join(ROOT_DIR, "public");

const app = express();

// 정적 파일 (dotfiles 포함)
app.use(
  express.static(PUBLIC_DIR, {
    dotfiles: "allow",
  })
);

// 명시 라우트: 플러그인 매니페스트 & OpenAPI
app.get("/.well-known/ai-plugin.json", (_req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, ".well-known", "ai-plugin.json"));
});
app.get("/openapi.yaml", (_req, res) => {
  res.type("text/yaml");
  res.sendFile(path.join(PUBLIC_DIR, "openapi.yaml"));
});

// 공통 미들웨어 & API
app.use(cors());
app.use(express.json());
app.use("/api", routes);

// 헬스체크
app.get("/healthz", (_req, res) => res.json({ ok: true }));

// 루트
app.get("/", (_req, res) => {
  res.json({
    name: "YunaHub",
    plugin_manifest: "/.well-known/ai-plugin.json",
    openapi: "/openapi.yaml",
    health: "/healthz",
  });
});

// ✅ Vercel serverless: handler export (listen 금지)
export default (req, res) => app(req, res);
