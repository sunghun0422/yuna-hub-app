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

// 정적 파일 제공
app.use(express.static(path.join(__dirname, "../public")));
app.use("/.well-known", express.static(path.join(__dirname, "../public/.well-known")));

// 헬스 체크
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// OpenAPI
app.get("/openapi.yaml", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/.well-known/openapi.yaml"));
});

// 메인 라우트
app.use("/api", routes);

// 루트 페이지
app.get("/", (req, res) => {
  res.status(200).send("💗 Yuna Hub App running perfectly on Vercel Serverless");
});

// 서버리스 핸들러로 내보내기
export const handler = serverless(app);
export default app;
