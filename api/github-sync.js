import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    // 1️⃣ 리포지토리와 브랜치 설정
    const repo = "sunghun0422/yuna-hub-app";
    const branch = "dev_v13"; // 최신 브랜치로 수정

    // 2️⃣ 환경 변수 확인
    const token = process.env.GH_TOKEN;
    if (!token) {
      console.error("❌ GH_TOKEN is missing or not loaded from environment.");
      return res.status(500).json({
        ok: false,
        error: "Missing GitHub token (GH_TOKEN)",
      });
    }
    console.log("✅ GH_TOKEN loaded successfully.");

    // 3️⃣ GitHub API 호출 URL
    const apiUrl = `https://api.github.com/repos/${repo}/contents/?ref=${branch}`;

    // 4️⃣ API 요청
    const response = await fetch(apiUrl, {
      headers: { Authorization: `token ${token}` },
    });

    if (!response.ok) {
      console.error(`❌ GitHub API response error: ${response.status} ${response.statusText}`);
      return res.status(response.status).json({
        ok: false,
        error: `GitHub API returned ${response.status}: ${response.statusText}`,
      });
    }

    // 5️⃣ 데이터 파싱
    const data = await response.json();
    if (!Array.isArray(data)) {
      console.error("⚠️ Unexpected response from GitHub:", data);
      return res.status(500).json({
        ok: false,
        error: "Unexpected response format from GitHub API",
      });
    }

    // 6️⃣ 성공 응답
    const files = data.map((f) => f.name);
    return res.status(200).json({
      ok: true,
      repo,
      branch,
      count: files.length,
      files: files.slice(0, 10), // 최대 10개만 반환
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("🔥 Server Error:", err);
    return res.status(500).json({
      ok: false,
      error: err.message || "Internal Server Error",
    });
  }
}
