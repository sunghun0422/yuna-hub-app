// /api/github-index.js

import {
  ensureFetchAvailable,
  parseJsonBody,
  resolvePath,
  splitRepo,
  requireGitHubToken,
  createGitHubHeaders,
  buildContentsUrl,
  readResponseBody,
  isoTimestamp,
} from "./_lib/github-helpers.js";

const ALLOWED_METHODS = new Set(["GET", "POST"]);

function normalizeInput(value) {
  if (Array.isArray(value)) {
    return value.length > 0 ? String(value[0]).trim() : "";
  }
  if (value == null) {
    return "";
  }
  return String(value).trim();
}

function summarizeItem(item) {
  if (!item || typeof item !== "object") {
    return null;
  }
  const summary = {
    name: item.name,
    path: item.path,
    type: item.type,
  };
  if (item.sha) {
    summary.sha = item.sha;
  }
  if (typeof item.size === "number") {
    summary.size = item.size;
  }
  return summary;
}

export const config = {
  runtime: "nodejs20.x",
};

export default async function handler(req, res) {
  if (!ALLOWED_METHODS.has(req.method)) {
    console.error(`[github-index] Method not allowed: ${req.method}`);
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    ensureFetchAvailable();

    const input =
      req.method === "GET" ? { ...(req.query || {}) } : parseJsonBody(req);

    const repoInput = normalizeInput(input.repo);
    const branchInput = normalizeInput(input.branch) || "main";
    const { clean: cleanPath, encoded: encodedPath } = resolvePath(input.path);

    if (!repoInput) {
      console.error("[github-index] Missing repo parameter");
      return res
        .status(400)
        .json({ ok: false, error: "`repo` is required", timestamp: isoTimestamp() });
    }

    let owner;
    let repoName;
    try {
      ({ owner, repo: repoName } = splitRepo(repoInput));
    } catch (error) {
      console.error(`[github-index] Invalid repo format: ${repoInput}`);
      return res.status(400).json({
        ok: false,
        error: error.message,
        timestamp: isoTimestamp(),
      });
    }

    let token;
    try {
      token = requireGitHubToken();
    } catch (error) {
      console.error(`[github-index] ${error.message}`);
      return res.status(500).json({ ok: false, error: error.message, timestamp: isoTimestamp() });
    }

    const headers = createGitHubHeaders(token);
    const url = buildContentsUrl({
      owner,
      repo: repoName,
      encodedPath,
      branch: branchInput,
    });

    const response = await fetch(url, { headers });

    if (response.status === 404) {
      return res.status(200).json({
        ok: true,
        count: 0,
        files: [],
        branch: branchInput,
        path: cleanPath,
        timestamp: isoTimestamp(),
      });
    }

    if (!response.ok) {
      const errorText = await readResponseBody(response);
      console.error(
        `[github-index] GitHub API error ${response.status}: ${errorText}`
      );
      return res.status(response.status).json({
        ok: false,
        error: `GitHub API ${response.status}: ${errorText || response.statusText}`,
        branch: branchInput,
        path: cleanPath,
        timestamp: isoTimestamp(),
      });
    }

    const data = await response.json();
    const files = Array.isArray(data)
      ? data.map(summarizeItem).filter(Boolean)
      : [summarizeItem(data)].filter(Boolean);

    return res.status(200).json({
      ok: true,
      count: files.length,
      files,
      branch: branchInput,
      path: cleanPath,
      timestamp: isoTimestamp(),
    });
  } catch (error) {
    console.error("[github-index] Unexpected error", error);
    return res.status(500).json({
      ok: false,
      error: error && error.message ? error.message : "Unknown error",
      timestamp: isoTimestamp(),
    });
  }
}
