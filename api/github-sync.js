// /api/github-sync.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  console.log("🟢 [github-sync] Function started");

  try {
    // 요청 본문 로깅
    console.log("📩 Incoming request body:", req.body);

    const { repo, branch, path, content } = req.body;

    // 환경변수 확인
    const token = process.env.GH_TOKEN;
    console.log("🔐 GH_TOKEN loaded:", !!token);

    if (!token) {
      console.error("❌ Missing GitHub token in environment");
      return res.status(500).json({
        ok: false,
        error: "Missing GitHub token (GH_TOKEN not found in environment variables)",
      });
    }

    // content base64 인코딩
    const encodedContent = Buffer.from(content || "").toString("base64");

    // GitHub API endpoint
    const url = `https://api.github.com/repos/${repo}/contents/${path}`;
    console.log("🌍 Target URL:", url);

    // API 요청
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Update via Vercel API at ${new Date().toISOString()}`,
        content: encodedContent,
        branch,
      }),
    });

    const resultText = await response.text();
    console.log("📦 GitHub API raw response:", resultText);

    // 실패 처리
    if (!response.ok) {
      console.error("❗ GitHub API Error", response.status, resultText);
      return res.status(response.status).json({
        ok: false,
        status: response.status,
        error: resultText,
      });
    }

    // 성공 응답
    console.log("✅ File successfully synced to GitHub!");
    res.status(200).json({
      ok: true,
      message: "File successfully synced to GitHub",
      response: JSON.parse(resultText),
    });

  } catch (err) {
    console.error("💥 Unhandled error in github-sync:", err);
    res.status(500).json({
      ok: false,
      error: err.message,
      stack: err.stack,
    });
  }
}
