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

// ✅ static 경로 설정
app.use(express.static(path.join(__dirname, "../public")));
app.use("/.well-known", express.static(path.join(__dirname, "../public/.well-known")));

// ✅ health check
app.get("/healthz", (req, res) => {
  res.json({ status: "ok", message: "Yuna Hub backend alive" });
});

// ✅ openapi.yaml 직접 접근
app.get("/openapi.yaml", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/openapi.yaml"));
});

// ✅ 라우트 연결
app.use("/api", routes);

// ✅ 기본 루트
app.get("/", (req, res) => {
  res.send("💗 Yuna Hub Server is running on Vercel!");
});

// ✅ serverless export
export default serverless(app);
