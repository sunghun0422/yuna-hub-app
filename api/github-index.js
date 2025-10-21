import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const { repo, branch } = req.body || {};

    if (!repo || !branch) {
      return res.status(400).json({ ok: false, error: "Missing repo or branch" });
    }

    const token = process.env.GH_TOKEN;
    if (!token) {
      return res.status(500).json({ ok: false, error: "Missing GH_TOKEN in environment" });
    }

    const url = `https://api.github.com/repos/${repo}/contents/?ref=${branch}`;
    const response = await fetch(url, {
      headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json" }
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ ok: false, error: text });
    }

    const data = await response.json();
    const files = Array.isArray(data) ? data.map((f) => f.name) : [];

    res.status(200).json({
      ok: true,
      repo,
      branch,
      count: files.length,
      files: files.slice(0, 10),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
