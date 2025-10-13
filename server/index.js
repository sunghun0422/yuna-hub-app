import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import serverless from "serverless-http";
import routes from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors());
app.use(express.json());

// ✅ 정적 파일
app.use(express.static(path.resolve("public")));
app.use("/.well-known", express.static(path.resolve("public/.well-known")));

// ✅ 헬스체크
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok", message: "Yuna Hub alive" });
});

// ✅ OpenAPI YAML 직접 제공
app.get("/openapi.yaml", (req, res) => {
  res.sendFile(path.resolve("public/openapi.yaml"));
});

// ✅ API 라우트 연결
app.use("/api", routes);

// ✅ 루트 페이지
app.get("/", (req, res) => {
  res.send("💗 Yuna Hub App is running successfully!");
});

// ✅ serverless handler 내보내기
export const handler = serverless(app);
export default app;
