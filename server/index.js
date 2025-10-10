import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import router from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", router);

// Static 파일 처리
app.use(express.static(path.join(__dirname, "../public")));
app.use("/.well-known", express.static(path.join(__dirname, "../public/.well-known")));

// Health 체크
app.get("/healthz", (req, res) => {
  res.status(200).json({ ok: true });
});

// 루트 응답
app.get("/", (req, res) => {
  res.send("Yuna Hub App is running!");
});

export default app;
