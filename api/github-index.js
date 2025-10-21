// api/github-index.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const { repo, branch, path = "" } = req.body;

    // ✅ 기본값: path 미지정 시 root 기준
    const url = `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `token ${process.env.GH_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    res.status(200).json({
      ok: true,
      count: data.length,
      files: data.map((f) => ({
        name: f.name,
        path: f.path,
        type: f.type,
      })),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
}
