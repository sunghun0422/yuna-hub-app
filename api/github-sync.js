export default async function handler(req, res) {
  try {
    const repo = "sunghun0422/yuna-hub-app";
    const branch = "dev_v13"; // 최신 브랜치
    const token = process.env.GH_TOKEN;

    if (!token) {
      return res.status(500).json({
        status: "error",
        message: "Missing GH_TOKEN environment variable"
      });
    }

    const apiUrl = `https://api.github.com/repos/${repo}/contents/?ref=${branch}`;
    const response = await fetch(apiUrl, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github+json",
        "User-Agent": "YunaHub-Pro-Server"
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({
        status: "error",
        message: `GitHub API error: ${response.statusText}`,
        details: errText
      });
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return res.status(500).json({
        status: "error",
        message: "Unexpected GitHub API response format"
      });
    }

    const files = data.map(f => f.name);
    res.status(200).json({
      status: "ok",
      repo,
      branch,
      fileCount: files.length,
      files: files.slice(0, 10),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "Unknown internal error"
    });
  }
}
