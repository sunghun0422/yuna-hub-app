import { Buffer } from "node:buffer";

export const GITHUB_API_BASE = "https://api.github.com";

export function ensureFetchAvailable() {
  if (typeof fetch !== "function") {
    throw new Error(
      "Global fetch API is not available in this runtime. Node.js 18+ is required."
    );
  }
}

export function parseJsonBody(req) {
  if (!req || req.body == null) {
    return {};
  }

  const body = req.body;

  if (typeof body === "object" && !Buffer.isBuffer(body)) {
    return body;
  }

  const text = Buffer.isBuffer(body) ? body.toString("utf8") : String(body);
  if (!text.trim()) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("[github-helpers] Failed to parse JSON body", error);
    return {};
  }
}

export function resolvePath(input) {
  if (input == null) {
    return { clean: "", encoded: "" };
  }

  const cleaned = String(input).trim().replace(/^\/+|\/+$/g, "");
  if (!cleaned) {
    return { clean: "", encoded: "" };
  }

  const segments = cleaned.split("/").filter(Boolean);
  const clean = segments.join("/");
  const encoded = segments.map((segment) => encodeURIComponent(segment)).join("/");

  return { clean, encoded };
}

export function splitRepo(repo) {
  if (!repo) {
    throw new Error("`repo` is required");
  }

  const [ownerRaw, repoRaw, ...rest] = String(repo).split("/");
  if (!ownerRaw || !repoRaw || rest.length > 0) {
    throw new Error("`repo` must be provided in the format 'owner/repo'");
  }

  const owner = ownerRaw.trim();
  const name = repoRaw.trim();

  if (!owner || !name) {
    throw new Error("`repo` must be provided in the format 'owner/repo'");
  }

  return { owner, repo: name };
}

export function requireGitHubToken() {
  const token = process.env.GH_TOKEN;
  if (!token) {
    throw new Error("Missing GH_TOKEN environment variable");
  }
  return token;
}

export function createGitHubHeaders(token) {
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "yuna-hub-app",
    Authorization: `Bearer ${token}`,
  };
}

export function buildContentsUrl({ owner, repo, encodedPath = "", branch }) {
  const pathPart = encodedPath ? `/${encodedPath}` : "";
  const refPart = branch ? `?ref=${encodeURIComponent(branch)}` : "";
  return `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents${pathPart}${refPart}`;
}

export async function readResponseBody(response) {
  if (!response || typeof response.text !== "function") {
    return "";
  }
  try {
    return await response.text();
  } catch (error) {
    console.error("[github-helpers] Failed to read response body", error);
    return "";
  }
}

export function isoTimestamp() {
  return new Date().toISOString();
}
