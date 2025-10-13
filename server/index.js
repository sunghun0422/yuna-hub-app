import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors());
app.use(express.json());

// ✅ 정적 파일 제공
app.use(express.static(path.join(__dirname, "../public")));
app.use("/.well-known", express.static(path.join(__dirname, "../public/.well-known")));

// ✅ 헬스체크
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// ✅ OpenAPI YAML 제공
app.get("/openapi.yaml", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/.well-known/openapi.yaml"));
});

// ✅ API 라우트 연결
app.use("/api", routes);

// ✅ 루트 페이지
app.get("/", (req, res) => {
  res.status(200).send("💗 Yuna Hub App is running successfully!");
});

// ✅ Express 앱 직접 실행 (serverless-http 제거)
export default app;
