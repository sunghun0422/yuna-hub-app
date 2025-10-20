import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const repo = "sunghun0422/yuna-hub-app";
    const branch = "dev_v12";
    const token = process.env.GH_TOKEN;
    const apiUrl = `https://api.github.com/repos/${repo}/commits?sha=${branch}`;
    const response = await fetch(apiUrl, {
      headers: { Authorization: `token ${token}` }
    });
    const commits = await response.json();

    res.status(200).json({
      status: "indexed",
      repo,
      branch,
      latest_commit: commits?.[0]?.sha || "none",
      total_commits: commits.length
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}
