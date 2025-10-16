// /api/index.js
export default function handler(req, res) {
  const url = req.url || "";

  // ✅ favicon 요청 무시
  if (url.includes("favicon.ico")) {
    return res.status(204).end();
  }

  // ✅ 정상 응답
  if (url === "/api" || url === "/api/") {
    return res.status(200).json({
      ok: true,
      message: "YunaHub API server is running ✅",
      routes: {
        githubRead: "/api/github-read",
        githubSync: "/api/github-sync",
      },
      timestamp: new Date().toISOString(),
    });
  }

  // ✅ 나머지는 Not Found 처리
  return res.status(404).json({
    ok: false,
    message: `Not Found: ${url}`,
    hint: "Try /api/github-read or /api/github-sync",
  });
}
