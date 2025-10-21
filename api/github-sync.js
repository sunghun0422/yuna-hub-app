// /api/github-sync.js

import { Buffer } from "node:buffer";
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

const ALLOWED_METHODS = new Set(["POST", "PUT"]);

function normalizeInput(value) {
  if (Array.isArray(value)) {
    return value.length > 0 ? String(value[0]).trim() : "";
  }
  if (value == null) {
    return "";
  }
  return String(value).trim();
}

export const config = {
  runtime: "nodejs20.x",
};

export default async function handler(req, res) {
  if (!ALLOWED_METHODS.has(req.method)) {
    console.error(`[github-sync] Method not allowed: ${req.method}`);
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    ensureFetchAvailable();

    const body = parseJsonBody(req);
    const repoInput = normalizeInput(body.repo);
    const branchInput = normalizeInput(body.branch) || "main";
    const messageInput = normalizeInput(body.message) || "yuna-hub sync";
    const { clean: cleanPath, encoded: encodedPath } = resolvePath(body.path);
    const contentInput = body.content;

    if (!repoInput) {
      console.error("[github-sync] Missing repo parameter");
      return res.status(400).json({
        ok: false,
        error: "`repo` is required",
        timestamp: isoTimestamp(),
      });
    }

    if (!cleanPath) {
      console.error("[github-sync] Missing path parameter");
      return res.status(400).json({
        ok: false,
        error: "`path` is required",
        timestamp: isoTimestamp(),
      });
    }

    if (typeof contentInput !== "string") {
      console.error("[github-sync] Invalid content type", {
        typeof: typeof contentInput,
      });
      return res.status(400).json({
        ok: false,
        error: "`content` must be a string",
        timestamp: isoTimestamp(),
      });
    }

    let owner;
    let repoName;
    try {
      ({ owner, repo: repoName } = splitRepo(repoInput));
    } catch (error) {
      console.error(`[github-sync] Invalid repo format: ${repoInput}`);
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
      console.error(`[github-sync] ${error.message}`);
      return res.status(500).json({ ok: false, error: error.message, timestamp: isoTimestamp() });
    }

    const headers = createGitHubHeaders(token);

    const getUrl = buildContentsUrl({
      owner,
      repo: repoName,
      encodedPath,
      branch: branchInput,
    });

    let existingSha;
    const getResponse = await fetch(getUrl, { headers });
    if (getResponse.status === 200) {
      const json = await getResponse.json();
      if (json && typeof json === "object" && json.sha) {
        existingSha = json.sha;
      }
    } else if (getResponse.status !== 404) {
      const text = await readResponseBody(getResponse);
      console.error(`[github-sync] Probe failed ${getResponse.status}: ${text}`);
      return res.status(getResponse.status).json({
        ok: false,
        error: `Probe failed: ${text || getResponse.statusText}`,
        branch: branchInput,
        path: cleanPath,
        timestamp: isoTimestamp(),
      });
    }

    const putUrl = buildContentsUrl({ owner, repo: repoName, encodedPath });
    const payload = {
      message: messageInput,
      content: Buffer.from(contentInput, "utf8").toString("base64"),
      branch: branchInput,
      ...(existingSha ? { sha: existingSha } : {}),
    };

    const putResponse = await fetch(putUrl, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!putResponse.ok) {
      const text = await readResponseBody(putResponse);
      console.error(`[github-sync] GitHub PUT error ${putResponse.status}: ${text}`);
      return res.status(putResponse.status).json({
        ok: false,
        error: `GitHub PUT ${putResponse.status}: ${text || putResponse.statusText}`,
        branch: branchInput,
        path: cleanPath,
        timestamp: isoTimestamp(),
      });
    }

    const result = await putResponse.json();
    const commitSha =
      result && result.commit && typeof result.commit === "object"
        ? result.commit.sha
        : undefined;

    return res.status(200).json({
      ok: true,
      action: existingSha ? "updated" : "created",
      path: cleanPath,
      branch: branchInput,
      commit: commitSha,
      timestamp: isoTimestamp(),
    });
  } catch (error) {
    console.error("[github-sync] Unexpected error", error);
    return res.status(500).json({
      ok: false,
      error: error && error.message ? error.message : "Unknown error",
      timestamp: isoTimestamp(),
    });
  }
}
