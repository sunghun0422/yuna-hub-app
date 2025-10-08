// server/index.js
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

// ▼ 정적 파일 서빙에 필요한 import
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 정적 파일 (/public) → /.well-known/ai-plugin.json 서빙용
app.use(express.static(path.join(__dirname, "../public")));

app.use(cors());
app.use(express.json());
app.use("/api", routes);

// 헬스체크
app.get("/healthz", (req, res) => res.json({ ok: true }));

// Vercel 에서는 export 만 하면 됨 (listen 금지)
export default (req, res) => app(req, res);

// 로컬 개발용: npm run dev 시에만 listen
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Yuna Hub App running on http://localhost:${PORT}`);
  });
}
