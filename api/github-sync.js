export default async function handler(req, res) {
  console.log("📥 Request received:", req.body);

  try {
    const token = process.env.GH_TOKEN;
    if (!token) {
      console.error("❌ GH_TOKEN is missing from environment variables.");
      return res.status(500).json({
        ok: false,
        message: "Missing GH_TOKEN in environment variables.",
      });
    }

    const repo = req.body?.repo || "sunghun0422/yuna-hub-app";
    const branch = req.body?.branch || "dev_v13";
    const path = req.body?.path || "";
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`;

    console.log("📡 Sending request to GitHub API:", apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    console.log("📨 GitHub API response status:", response.status);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("❌ GitHub API Error:", errorBody);
      return res.status(response.status).json({
        ok: false,
        message: `GitHub API failed: ${response.statusText}`,
        detail: errorBody,
      });
    }

    const data = await response.json();
    console.log("📦 GitHub response data:", data);

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
    console.error("❌ Server crash:", error);
    return res.status(500).json({
      ok: false,
      message: error.message || "Unexpected server error.",
    });
  }
}
