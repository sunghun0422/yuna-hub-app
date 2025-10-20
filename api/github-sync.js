import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const repo = "sunghun0422/yuna-hub-app";
    const branch = "dev_v12";
    const token = process.env.GH_TOKEN;
    const apiUrl = `https://api.github.com/repos/${repo}/contents/?ref=${branch}`;
    const response = await fetch(apiUrl, {
      headers: { Authorization: `token ${token}` }
    });
    const data = await response.json();

    if (!Array.isArray(data))
      return res.status(500).json({ status: "error", message: "GitHub API error" });

    const files = data.map(f => f.name);
    res.status(200).json({
      status: "ok",
      repo,
      branch,
      files: files.slice(0, 10),
      count: files.length
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}
