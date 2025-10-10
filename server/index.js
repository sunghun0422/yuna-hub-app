import express from "express";
import cors from "cors";
import path from "path";
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api", routes);

// health check
app.get("/healthz", (req, res) => {
  res.status(200).json({ ok: true });
});

// 정적 파일 경로
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));
app.use("/.well-known", express.static(path.join(__dirname, "public/.well-known")));

app.get("/", (req, res) => {
  res.send("Yuna Hub App is running!");
});

export default app;
