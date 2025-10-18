export default function handler(req, res) {
  return res.status(200).json({
    ok: true,
    message: "✅ YunaHub API server is running properly",
    routes: {
      githubRead: "/api/github-read",
    },
    timestamp: new Date().toISOString(),
  });
}
