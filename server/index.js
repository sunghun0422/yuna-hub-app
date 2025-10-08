// server/index.js
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

// ▼▼▼ [추가: 정적 파일 서빙을 위해 필요] ▼▼▼
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ▲▲▲ 여기까지 3줄 + 2줄

const app = express();

// ✅ public 폴더(./public)를 정적으로 오픈
app.use(express.static(path.join(__dirname, "../public")));

app.use(cors());
app.use(express.json());
app.use("/api", routes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("💗 Yuna Hub App is running successfully!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
