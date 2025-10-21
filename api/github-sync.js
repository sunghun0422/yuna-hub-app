import fetch from "node-fetch";

export default async function handler(req, res) {
  // GET 요청도 확인용으로 열어둠
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const { repo, branch, path } = req.body || {};

    if (!repo || !branch) {
      return res.status(400).json({ ok: false, error: "Missing repo or branch" });
    }

    const token = process.env.GH_TOKEN;
    if (!token) {
      return res.status(500).json({ ok: false, error: "Missing GH_TOKEN in environment" });
    }

    const url = `https://api.github.com/repos/${repo}/contents/${path || ""}?ref=${branch}`;
    const response = await fetch(url, {
      headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json" }
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ ok: false, error: text });
    }

    const data = await response.json();

    // 정상 응답
    res.status(200).json({
      ok: true,
      repo,
      branch,
      path: path || "/",
      fileCount: Array.isArray(data) ? data.length : 1,
      preview:
        Array.isArray(data) && data.length
          ? data.slice(0, 5).map((f) => f.name)
          : data.name || null,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
