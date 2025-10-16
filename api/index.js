export default function handler(req, res) {
  // 루트 확인용
  if (req.url === '/api/' || req.url === '/api') {
    res.status(200).json({
      ok: true,
      message: "YunaHub API server is running ✅",
      routes: {
        githubRead: "/api/github-read",
        githubSync: "/api/github-sync",
        summarize: "/api/post_summarize_url"
      },
      timestamp: new Date().toISOString()
    });
    return;
  }

  // 다른 라우트는 자동 라우팅에 맡기기
  res.status(404).json({
    ok: false,
    message: "Not Found (handled by /api/index.js)",
    hint: "Try /api/github-read or /api/github-sync"
  });
}
