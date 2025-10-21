// /api/github-index.js
export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    // POST(JSON) 또는 GET(query) 모두 지원
    const body = req.method === "POST" ? req.body || {} : req.query || {};
    const { repo, branch = "main", path = "" } = body;

    if (!repo) {
      return res.status(400).json({ ok: false, error: "`repo` is required" });
    }

    // repo 형식: "owner/repo"
    const [owner, repoName] = String(repo).split("/");
    if (!owner || !repoName) {
      return res.status(400).json({ ok: false, error: "`repo` must be 'owner/repo' format" });
    }

    const GITHUB_API = "https://api.github.com";
    const token = process.env.GH_TOKEN;
    const headers = {
      Accept: "application/vnd.github+json",
      "User-Agent": "yuna-hub-app",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    // path가 비어 있으면 루트, 있으면 안전 인코딩
    const pathPart = path ? `/${encodeURI(path)}` : "";
    const url = `${GITHUB_API}/repos/${owner}/${repoName}/contents${pathPart}?ref=${encodeURIComponent(branch)}`;

    const response = await fetch(url, { headers });

    // 깃허브가 404면 "그 경로 없음" → 빈 목록으로 정리해 반환(사용성↑)
    if (response.status === 404) {
      return res.status(200).json({ ok: true, count: 0, files: [], timestamp: new Date().toISOString() });
    }
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        ok: false,
        error: `GitHub API ${response.status}: ${errorText}`,
        timestamp: new Date().toISOString(),
      });
    }

    const data = await response.json();

    // 디렉터리면 배열, 파일이면 객체
    const files = Array.isArray(data)
      ? data.map((f) => ({ name: f.name, path: f.path, type: f.type }))
      : [{ name: data.name, path: data.path, type: data.type }];

    return res.status(200).json({
      ok: true,
      count: files.length,
      files,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
}
