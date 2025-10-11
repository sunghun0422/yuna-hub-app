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

// ✅ public 및 .well-known 폴더 정적 제공
app.use(express.static(path.join(__dirname, "../public")));
app.use("/.well-known", express.static(path.join(__dirname, "../public/.well-known")));

// ✅ Health check (Vercel serverless 정상 확인용)
app.get("/healthz", (req, res) => {
  res.json({ status: "ok", message: "Yuna Hub alive" });
});

// ✅ OpenAPI spec
app.get("/openapi.yaml", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/openapi.yaml"));
});

// ✅ API 라우터 연결
app.use("/api", routes);

// ✅ 기본 루트 페이지
app.get("/", (req, res) => {
  res.send("💗 Yuna Hub App is running successfully!");
});

// ✅ Vercel serverless export
export default serverless(app);
