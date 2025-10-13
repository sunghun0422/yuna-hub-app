import express from "express";
import serverless from "serverless-http";

const app = express();

app.get("/healthz", (req, res) => {
  res.json({ ok: true, message: "Yuna Hub 💖 running smoothly" });
});

export default app;
export const handler = serverless(app);
