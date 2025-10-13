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

// ✅ 정적 파일 (OpenAPI 등)
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/.well-known", express.static(path.join(__dirname, "..", "public/.well-known")));

// ✅ 헬스 체크
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// ✅ OpenAPI 문서
app.get("/openapi.yaml", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public/.well-known/openapi.yaml"));
});

// ✅ 메인 API 라우트
app.use("/api", routes);

// ✅ 루트 페이지
app.get("/", (req, res) => {
  res.send("💗 Yuna Hub App is running smoothly on Vercel!");
});

// ✅ 서버 실행 (Vercel runtime)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

export default app;
