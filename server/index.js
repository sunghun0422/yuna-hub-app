import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes/index.js";

// ✅ Pro 기능 추가
import memory from "./routes/memory.js";
import storybook from "./routes/storybook.js";
import gmail from "./routes/gmail.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors());
app.use(express.json());

// ✅ public 및 .well-known 폴더를 정적으로 노출
app.use(express.static(path.join(__dirname, "../public")));
app.use(
  "/.well-known",
  express.static(path.join(__dirname, "../public/.well-known"))
);

// ✅ 헬스체크
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok", message: "Yuna Hub alive" });
});

// ✅ OpenAPI YAML 직접 제공
app.get("/openapi.yaml", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/openapi.yaml"));
});

// ✅ 기존 API 라우트
app.use("/api", routes);

// ✅ 새 Pro 버전 API 연결
app.use("/api/memory", memory);
app.use("/api/storybook", storybook);
app.use("/api/gmail", gmail);

// ✅ 루트 페이지
app.get("/", (req, res) => {
  res.send("💗 Yuna Hub App is running successfully!");
});

export default app;
