import express from "express";
import serverless from "serverless-http";

const app = express();

app.get("/", (req, res) => {
  res.json({ ok: true, message: "Yuna Hub 💖 root working" });
});

app.get("/healthz", (req, res) => {
  res.json({ ok: true, message: "Yuna Hub 💖 health check passed" });
});

export const handler = serverless(app);
export default app;
