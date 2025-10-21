import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const repo = "sunghun0422/yuna-hub-app";
    const branch = "dev_v13";
    const token = process.env.GH_TOKEN;

    // GitHub API 엔드포인트
    const apiUrl = `https://api.github.com/repos/${repo}/contents?ref=${branch}`;
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`GitHub API error: ${response.status} - ${errText}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return res
        .status(500)
        .json({ ok: false, message: "Unexpected GitHub response", data });
    }

    const files = data.map((item) => ({
      name: item.name,
      path: item.path,
      type: item.type,
    }));

    res.status(200).json({
      ok: true,
      repo,
      branch,
      fileCount: files.length,
      files: files.slice(0, 10),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}
