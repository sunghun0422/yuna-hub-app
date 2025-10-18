import express from "express";
const app = express();

app.get("/api", (req, res) => {
  res.json({
    ok: true,
    message: "YunaHub API server (Express mode) ✅",
    routes: {
      githubRead: "/api/github-read",
      githubSync: "/api/github-sync",
      summarize: "/api/post_summarize_url"
    },
    timestamp: new Date().toISOString()
  });
});

app.get("/api/github-read", (_, res) => {
  res.json({ ok: true, service: "yuna-hub", env: "express", route: "github-read" });
});

export default app;
