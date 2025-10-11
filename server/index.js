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

// ✅ public 및 .well-known 정적 파일 제공
app.use(express.static(path.join(__dirname, "../public")));
app.use("/.well-known", express.static(path.join(__dirname, "../public/.well-known")));

// ✅ 헬스 체크 엔드포인트
app.get("/healthz", (req, res) => {
  res.json({ ok: true });
});

// ✅ OpenAPI 스펙 직접 제공
app.get("/openapi.yaml", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/openapi.yaml"));
});

// ✅ 메인 API 라우트 연결
app.use("/api", routes);

// ✅ 루트 엔드포인트
app.get("/", (req, res) => {
  res.send("💗 Yuna Hub App is running successfully!");
});

// ✅ Vercel serverless 함수로 export
export default serverless(app);
