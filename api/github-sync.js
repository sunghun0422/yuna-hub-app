export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ ok: false, message: "Only POST requests allowed." });
    }

    const token = process.env.GH_TOKEN;
    if (!token) {
      return res.status(500).json({
        ok: false,
        message: "Missing GH_TOKEN in environment variables.",
      });
    }

    let body = req.body;
    // POSTMAN이나 JSON Body로 요청했는데 body가 안 올 경우 대비
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    const repo = body.repo || "sunghun0422/yuna-hub-app";
    const branch = body.branch || "dev_v13";
    const path = body.path || "";

    const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return res.status(response.status).json({
        ok: false,
        message: `GitHub API failed: ${response.statusText}`,
        detail: errorBody,
      });
    }

    const data = await response.json();
    const files = Array.isArray(data) ? data.map(f => f.name) : [data.name || "No files"];

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
    console.error("❌ Github Sync Server Error:", error);
    return res.status(500).json({
      ok: false,
      message: error.message || "Unexpected server error.",
    });
  }
}
