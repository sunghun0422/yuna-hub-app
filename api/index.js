// /api/index.js
// favicon.ico, 루트 /api 요청 시 500 방지 및 라우트 안내용

export default function handler(req, res) {
  const { url } = req;

  // favicon.ico 요청 처리
  if (url === "/favicon.ico") {
    res.status(204).end(); // No Content
    return;
  }

  // 루트 경로(/api)만 안내 메시지 표시
  if (url === "/api" || url === "/api/") {
    res.status(200).json({
      ok: true,
      message: "YunaHub API server is running ✅",
      routes: {
        githubRead: "/api/github-read",
        githubSync: "/api/github-sync",
        summarize: "/api/post_summarize_url"
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // 나머지 경로는 패스 → 다른 함수(API)에서 처리되게 함
  res.status(404).json({
    ok: false,
    message: "Not Found (handled by /api/index.js)",
    hint: "Try /api/github-read or /api/github-sync",
  });
}
