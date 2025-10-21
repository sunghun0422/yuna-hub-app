// /api/github-index.js

const GITHUB_API_BASE = "https://api.github.com";

function normalizePath(input) {
  if (!input) return "";
  const sanitized = String(input).trim().replace(/^\/+/g, "").replace(/\/+$/g, "");
  if (!sanitized) return "";
  return sanitized
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function getRequestBody(req) {
  if (!req) return {};
  if (req.body == null) return {};
  if (typeof req.body === "string" && req.body.length > 0) {
    try {
      return JSON.parse(req.body);
    } catch (err) {
      console.error("[github-index] Failed to parse JSON body", err);
      return {};
    }
  }
  if (typeof req.body === "object") return req.body;
  return {};
}

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "GET") {
    console.error(`[github-index] Method not allowed: ${req.method}`);
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const body = req.method === "POST" ? getRequestBody(req) : req.query || {};
    const { repo, branch = "main" } = body;
    const path = normalizePath(body.path);

    if (!repo) {
      console.error("[github-index] Missing repo parameter");
      return res.status(400).json({ ok: false, error: "`repo` is required" });
    }

    const [owner, repoName] = String(repo).split("/");
    if (!owner || !repoName) {
      console.error(`[github-index] Invalid repo format: ${repo}`);
      return res.status(400).json({ ok: false, error: "`repo` must be 'owner/repo' format" });
    }

    const token = process.env.GH_TOKEN;
    if (!token) {
      const message = "Missing GH_TOKEN environment variable";
      console.error(`[github-index] ${message}`);
      return res.status(500).json({ ok: false, error: message });
    }

    const headers = {
      Accept: "application/vnd.github+json",
      "User-Agent": "yuna-hub-app",
      Authorization: `Bearer ${token}`,
    };

    const branchParam = encodeURIComponent(String(branch || "main"));
    const pathPart = path ? `/${path}` : "";
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repoName}/contents${pathPart}?ref=${branchParam}`;

    const response = await fetch(url, { headers });

    if (response.status === 404) {
      return res.status(200).json({
        ok: true,
        count: 0,
        files: [],
        branch,
        path: path || "",
        timestamp: new Date().toISOString(),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[github-index] GitHub API error ${response.status}: ${errorText}`);
      return res.status(response.status).json({
        ok: false,
        error: `GitHub API ${response.status}: ${errorText}`,
        timestamp: new Date().toISOString(),
      });
    }

    const data = await response.json();

    const files = Array.isArray(data)
      ? data.map((item) => ({ name: item.name, path: item.path, type: item.type }))
      : [{ name: data.name, path: data.path, type: data.type }];

    return res.status(200).json({
      ok: true,
      count: files.length,
      files,
      branch,
      path: path || "",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[github-index] Unexpected error", err);
    return res.status(500).json({
      ok: false,
      error: err && err.message ? err.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
}
