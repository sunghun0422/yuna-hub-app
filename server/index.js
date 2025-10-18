import express from "express";
const app = express();

// ✅ 루트 상태 확인
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

// ✅ GitHub Read endpoint
app.get("/api/github-read", (req, res) => {
  res.json({
    ok: true,
    service: "yuna-hub",
    env: "production",
    route: "github-read",
    timestamp: new Date().toISOString()
  });
});

// ✅ (선택) 기타 API 예시
app.get("/api/github-sync", (req, res) => {
  res.json({
    ok: true,
    route: "github-sync",
    message: "Sync route active ✅"
  });
});

app.get("/api/post_summarize_url", (req, res) => {
  res.json({
    ok: true,
    route: "post_summarize_url",
    message: "Summarization route active ✅"
  });
});

// ✅ export (Vercel용)
export default app;
