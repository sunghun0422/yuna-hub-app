// server/index.js

import express from "express";

import cors from "cors";

import routes from "./routes/index.js";

import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use("/api", routes);

// ✅ public 폴더를 정적 경로로 등록

app.use(express.static(path.join(__dirname, "../public")));

// ✅ .well-known 폴더도 별도로 오픈

app.use("/.well-known", express.static(path.join(__dirname, "../public/.well-known")));

app.get("/", (req, res) => {

res.send("💗 Yuna Hub App is running successfully!");

});

app.listen(PORT, () => {

console.log(🚀 Server running on port ${PORT});

});

이거  바꿔야하면 통째로 줘봐

