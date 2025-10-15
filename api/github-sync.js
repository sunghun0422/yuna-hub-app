import { Octokit } from "@octokit/rest";

export default async function handler(req, res) {
  const octokit = new Octokit({ auth: process.env.GH_TOKEN });
  const owner = "sunghun0422";
  const repo = "yuna-hub-app";
  const path = "DB/01_HUB/YeoSi_YunaHub/12/";

  try {
    const { data: files } = await octokit.repos.getContent({ owner, repo, path });

    const meta = files.map((f) => ({
      name: f.name,
      path: f.path,
      sha: f.sha,
      size: f.size,
      url: f.html_url,
      updated_at: new Date().toISOString(),
    }));

    res.status(200).json({
      ok: true,
      total_files: meta.length,
      synced: meta.slice(0, 5), // 요약 미리보기
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message,
      step: "github-sync",
    });
  }
}
