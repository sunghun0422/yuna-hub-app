export default async function handler(req, res) {
  try {
    // ✅ 1. 환경변수 (Vercel에 GH_TOKEN 등록되어 있어야 함)
    const token = process.env.GH_TOKEN;
    if (!token) {
      return res.status(500).json({
        ok: false,
        message: "Missing GH_TOKEN in environment variables.",
      });
    }

    // ✅ 2. Body parsing (POST 요청 또는 기본값)
    let body = {};
    try {
      if (req.method === "POST") body = req.body;
    } catch {
      body = {};
    }

    const repo = body.repo || "sunghun0422/yuna-hub-app";
    const branch = body.branch || "dev_v13";
    const path = body.path || "";

    // ✅ 3. GitHub API URL 생성
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`;

    // ✅ 4. Fetch 요청 (내장 fetch 사용)
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github+json",
      },
    });

    const data = await response.json();

    // ✅ 5. 오류 처리
    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        message: `GitHub API Error: ${data.message || "Unknown error"}`,
      });
    }

    // ✅ 6. 결과 변환
    const files = Array.isArray(data)
      ? data.map((f) => f.name)
      : [data.name || "No files"];

    return res.status(200).json({
      ok: true,
      repo,
      branch,
      path: path || "(root)",
      count: files.length,
      files,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Sync Error:", error);
    return res.status(500).json({
      ok: false,
      message: error.message || "Internal Server Error",
    });
  }
}
