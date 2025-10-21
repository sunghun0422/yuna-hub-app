// /api/github-sync.js

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
      console.error("[github-sync] Failed to parse JSON body", err);
      return {};
    }
  }
  if (typeof req.body === "object") return req.body;
  return {};
}

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "PUT") {
    console.error(`[github-sync] Method not allowed: ${req.method}`);
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const body = getRequestBody(req);
    const { repo, branch = "main", content, message = "yuna-hub sync" } = body;
    const path = normalizePath(body.path);

    if (!repo) {
      console.error("[github-sync] Missing repo parameter");
      return res.status(400).json({ ok: false, error: "`repo` is required" });
    }
    if (!path) {
      console.error("[github-sync] Missing path parameter");
      return res.status(400).json({ ok: false, error: "`path` is required" });
    }
    if (typeof content !== "string") {
      console.error("[github-sync] Invalid content type", { typeof: typeof content });
      return res.status(400).json({ ok: false, error: "`content` must be a string" });
    }

    const [owner, repoName] = String(repo).split("/");
    if (!owner || !repoName) {
      console.error(`[github-sync] Invalid repo format: ${repo}`);
      return res.status(400).json({ ok: false, error: "`repo` must be 'owner/repo' format" });
    }

    const token = process.env.GH_TOKEN;
    if (!token) {
      const messageText = "Missing GH_TOKEN environment variable";
      console.error(`[github-sync] ${messageText}`);
      return res.status(500).json({ ok: false, error: messageText });
    }

    const headers = {
      Accept: "application/vnd.github+json",
      "User-Agent": "yuna-hub-app",
      Authorization: `Bearer ${token}`,
    };

    const branchParam = encodeURIComponent(String(branch || "main"));
    const targetPath = path;

    // 1) Check if file exists to obtain SHA
    const getUrl = `${GITHUB_API_BASE}/repos/${owner}/${repoName}/contents/${targetPath}?ref=${branchParam}`;
    let sha;

    const getResponse = await fetch(getUrl, { headers });
    if (getResponse.ok) {
      const json = await getResponse.json();
      sha = json && json.sha ? json.sha : undefined;
    } else if (getResponse.status !== 404) {
      const text = await getResponse.text();
      console.error(`[github-sync] Probe failed ${getResponse.status}: ${text}`);
      return res.status(getResponse.status).json({ ok: false, error: `Probe failed: ${text}` });
    }

    // 2) Create or update file
    const putUrl = `${GITHUB_API_BASE}/repos/${owner}/${repoName}/contents/${targetPath}`;
    const putBody = {
      message,
      content: Buffer.from(content, "utf8").toString("base64"),
      branch,
      ...(sha ? { sha } : {}),
    };

    const putResponse = await fetch(putUrl, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(putBody),
    });

    if (!putResponse.ok) {
      const text = await putResponse.text();
      console.error(`[github-sync] GitHub PUT error ${putResponse.status}: ${text}`);
      return res.status(putResponse.status).json({
        ok: false,
        error: `GitHub PUT ${putResponse.status}: ${text}`,
      });
    }

    const result = await putResponse.json();
    return res.status(200).json({
      ok: true,
      action: sha ? "updated" : "created",
      path,
      branch,
      commit: result.commit && result.commit.sha,
    });
  } catch (err) {
    console.error("[github-sync] Unexpected error", err);
    return res.status(500).json({
      ok: false,
      error: err && err.message ? err.message : "Unknown error",
    });
  }
}
