import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes/index.js";
import serverless from "serverless-http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// 정적 제공 (public, .well-known)
app.use(express.static(path.join(__dirname, "../public")));
app.use("/.well-known", express.static(path.join(__dirname, "../public/.well-known")));

// 헬스 체크
app.get("/healthz", (req, res) => {
  res.json({ ok: true });
});

// OpenAPI 파일 직접 제공(서버리스 라우팅 보강)
app.get("/openapi.yaml", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/openapi.yaml"));
});

// API 라우트
app.use("/api", routes);

// 루트
app.get("/", (req, res) => {
  res.send("💗 Yuna Hub App is running successfully!");
});

// serverless 핸들러 export (Vercel)
export default serverless(app);
