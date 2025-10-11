import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// ✅ 정적 파일 서빙 (.well-known 포함)
app.use(express.static(path.join(__dirname, "../public")));
app.use("/.well-known", express.static(path.join(__dirname, "../public/.well-known")));

// ✅ Health check
app.get("/healthz", (req, res) => res.json({ ok: true }));

// ✅ OpenAPI YAML 직접 제공
app.get("/openapi.yaml", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/openapi.yaml"));
});

// ✅ API 라우트
app.use("/api", routes);

// ✅ 루트 페이지
app.get("/", (req, res) => {
  res.send("💗 Yuna Hub is running successfully!");
});

export default serverless(app);
