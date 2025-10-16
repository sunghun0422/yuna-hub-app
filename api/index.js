export default function handler(req, res) {
  const url = req.url || "";

  // ✅ favicon 무시
  if (url.includes("favicon.ico")) {
    return res.status(204).end();
  }

  // ✅ 루트 확인용
  if (url === "/api" || url === "/api/") {
    return res.status(200).json({
      ok: true,
      message: "YunaHub API server is running ✅",
      routes: {
        githubRead: "/api/github-read",
        githubSync: "/api/github-sync",
        summarize: "/api/post_summarize_url"
      },
      timestamp: new Date().toISOString()
    });
  }

  // ✅ /api 하위 경로는 자동 라우팅에 맡김
  if (url.startsWith("/api/")) {
    return res.status(404).json({
      ok: false,
      message: `No handler in index.js for this path: ${url}`,
      hint: "This route should be handled by its own file in /api/"
    });
  }

  // ✅ 기타 비-API 요청
  res.status(404).json({
    ok: false,
    message: "Not Found"
  });
}
