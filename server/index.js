import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import serverless from "serverless-http";
import routes from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

app.use(cors());
app.use(express.json());

// ✅ public 경로 안전 처리
const publicPath = resolve(process.cwd(), "public");
app.use(express.static(publicPath));
app.use("/.well-known", express.static(resolve(publicPath, ".well-known")));

// ✅ health check
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok", message: "💗 Yuna Hub running fine" });
});

// ✅ openapi.yaml serve
app.get("/openapi.yaml", (req, res) => {
  res.sendFile(resolve(publicPath, ".well-known/openapi.yaml"));
});

// ✅ API routes
app.use("/api", routes);

// ✅ root route
app.get("/", (req, res) => {
  res.send("💗 Yuna Hub App is alive & connected!");
});

// ✅ serverless export
export const handler = serverless(app);
export default app;
