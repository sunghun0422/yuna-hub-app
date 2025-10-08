import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();
app.use(express.json());

app.use(cors({
  origin: ["https://chat.openai.com", "https://chatgpt.com"],
  methods: ["GET","POST","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

app.get("/healthz", (_req, res) => res.json({ ok: true }));
app.get("/", (_req, res) => {
  res.json({
    name: "YunaHub",
    plugin_manifest: "/ai-plugin.json",
    openapi: "/openapi.yaml",
    health: "/healthz"
  });
});

app.use(routes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`YunaHub API running on :${port}`));
