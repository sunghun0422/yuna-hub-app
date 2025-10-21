import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const repo = "sunghun0422/yuna-hub-app";
    const branch = "dev_v13";
    const token = process.env.GH_TOKEN;

    const apiUrl = `https://api.github.com/repos/${repo}/contents?ref=${branch}`;
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const data = await response.json();

    if (!Array.isArray(data)) {
      return res
        .status(500)
        .json({ ok: false, message: "GitHub API returned unexpected result", data });
    }

    const files = data.map((item) => item.name);
    res.status(200).json({ ok: true, repo, branch, count: files.length, files });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
}
