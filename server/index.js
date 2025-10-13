import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import serverless from "serverless-http";
import routes from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

// ✅ 미들웨어 설정
app.use(cors());
app.use(express.json());

// ✅ 안전한 루트 경로 계산 (Vercel serverless 환경 대응)
const rootDir = resolve(process.cwd(), "public");

// ✅ 정적 파일 노출
app.use(express.static(rootDir));
app.use("/.well-known", express.static(resolve(rootDir, ".well-known")));

// ✅ 헬스체크
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok", message: "Yuna Hub alive 💗" });
});

// ✅ OpenAPI YAML 직접 제공
app.get("/openapi.yaml", (req, res) => {
  res.sendFile(resolve(rootDir, "openapi.yaml"));
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
