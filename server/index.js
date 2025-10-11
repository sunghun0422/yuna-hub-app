// server/index.js
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

// ✅ Static paths
app.use(express.static(path.join(__dirname, "../public")));
app.use("/.well-known", express.static(path.join(__dirname, "../public/.well-known")));

// ✅ Health check
app.get("/healthz", (req, res) => res.json({ ok: true }));

// ✅ OpenAPI spec
app.get("/openapi.yaml", (req, res) =>
  res.sendFile(path.join(__dirname, "../public/openapi.yaml"))
);

// ✅ Main routes
app.use("/api", routes);

// ✅ Default route
app.get("/", (req, res) => res.send("💗 Yuna Hub is running successfully on Vercel!"));

export default app;
