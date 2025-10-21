// /api/github-sync.js
export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "PUT") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const { repo, branch = "main", path, content, message = "yuna-hub sync" } = req.body || {};

    if (!repo) return res.status(400).json({ ok: false, error: "`repo` is required" });
    if (!path) return res.status(400).json({ ok: false, error: "`path` is required" });
    if (typeof content !== "string") {
      return res.status(400).json({ ok: false, error: "`content` must be a string" });
    }

    const [owner, repoName] = String(repo).split("/");
    if (!owner || !repoName) {
      return res.status(400).json({ ok: false, error: "`repo` must be 'owner/repo' format" });
    }

    const token = process.env.GH_TOKEN;
    if (!token) {
      return res.status(500).json({ ok: false, error: "Missing GH_TOKEN in environment" });
    }

    const GITHUB_API = "https://api.github.com";
    const headers = {
      Accept: "application/vnd.github+json",
      "User-Agent": "yuna-hub-app",
      Authorization: `Bearer ${token}`,
    };

    // 1) 현재 파일 존재여부 확인(sha 필요 여부 판단)
    const getUrl = `${GITHUB_API}/repos/${owner}/${repoName}/contents/${encodeURI(path)}?ref=${encodeURIComponent(branch)}`;
    let sha = undefined;

    const headResp = await fetch(getUrl, { headers });
    if (headResp.ok) {
      const json = await headResp.json();
      if (json && json.sha) sha = json.sha; // 업데이트 시 필요
    } else if (headResp.status !== 404) {
      const t = await headResp.text();
      return res.status(headResp.status).json({ ok: false, error: `Probe failed: ${t}` });
    }

    // 2) PUT으로 생성/수정
    const putUrl = `${GITHUB_API}/repos/${owner}/${repoName}/contents/${encodeURI(path)}`;
    const putBody = {
      message,
      content: Buffer.from(content, "utf8").toString("base64"),
      branch,
      ...(sha ? { sha } : {}),
    };

    const putResp = await fetch(putUrl, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(putBody),
    });

    if (!putResp.ok) {
      const errorText = await putResp.text();
      return res.status(putResp.status).json({
        ok: false,
        error: `GitHub PUT ${putResp.status}: ${errorText}`,
      });
    }

    const result = await putResp.json();
    return res.status(200).json({
      ok: true,
      action: sha ? "updated" : "created",
      path,
      branch,
      commit: result.commit && result.commit.sha,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
}
