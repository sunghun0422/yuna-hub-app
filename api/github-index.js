// api/github-index.js

export default async function handler(req, res) {
  try {
    const payload = req.method === "GET" ? req.query : req.body || {};
    const { repo, branch, path = "" } = payload;

    if (!repo || !branch) {
      return res.status(400).json({
        ok: false,
        error: "Missing required parameters: repo and branch are required.",
      });
    }

    const token = process.env.GH_TOKEN;
    if (!token) {
      return res.status(500).json({
        ok: false,
        error: "Missing GitHub token (GH_TOKEN)",
      });
    }

    const normalizedPath = (path || "")
      .toString()
      .replace(/^\/+/, "")
      .replace(/\/+$/, "");
    const apiPath = normalizedPath ? `contents/${normalizedPath}` : "contents";
    const url = `https://api.github.com/repos/${repo}/${apiPath}?ref=${encodeURIComponent(branch)}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const files = Array.isArray(data) ? data : [data];

    res.status(200).json({
      ok: true,
      count: files.length,
      files: files.map((f) => ({
        name: f.name,
        path: f.path,
        type: f.type,
      })),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("❌ Error in /api/github-index:", err);
    res.status(500).json({
      ok: false,
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
}
