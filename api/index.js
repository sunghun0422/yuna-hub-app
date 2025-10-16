// /api/index.js
// favicon.ico, 루트 /api 요청 시 500 방지용

export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    message: "YunaHub API server is running ✅",
    routes: {
      githubRead: "/api/github-read",
    },
    timestamp: new Date().toISOString(),
  });
}
