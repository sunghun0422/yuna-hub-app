export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { repo, branch, path, content, sha } = req.body || {};
    console.log("[github-sync] Incoming request:", req.body);

    if (!repo || !branch || !path || !content) {
      return res.status(400).json({ error: "Missing required fields: repo, branch, path, content" });
    }

    const encodedContent = Buffer.from(content).toString("base64");
    const url = `https://api.github.com/repos/${repo}/contents/${path}`;

    const payload = {
      message: "Sync content via API",
      content: encodedContent,
      branch,
      ...(sha ? { sha } : {}) // sha 값이 있으면 추가 (수정), 없으면 새로 만들기
    };

    const githubResponse = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `token ${process.env.GH_TOKEN}`,
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const text = await githubResponse.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("[github-sync] Failed to parse JSON:", e);
      data = text;
    }

    if (!githubResponse.ok) {
      console.error("[github-sync] GitHub API error:", githubResponse.status, data);
      return res.status(githubResponse.status).json({ error: data });
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("[github-sync] Unexpected server error:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
}
