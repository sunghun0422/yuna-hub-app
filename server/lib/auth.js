// /server/lib/auth.js
// Lightweight auth utilities & Express middlewares.
// Default: no auth required (plugin spec uses "auth: none").
// If you set YUNA_API_KEYS (comma-separated), Bearer/Query auth will be enforced.

const HEADER_NAME = "authorization";

/** Parse "Authorization: Bearer <token>" header */
function parseBearer(req) {
  const h = req.headers?.[HEADER_NAME];
  if (!h || typeof h !== "string") return null;
  const [scheme, token] = h.split(" ");
  if (!scheme || !token) return null;
  if (scheme.toLowerCase() !== "bearer") return null;
  return token.trim();
}

/** Read API keys from env (comma-separated, trimmed) */
function getAllowedKeys() {
  const raw = process.env.YUNA_API_KEYS || "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Express middleware: optional auth (always passes). Attaches req.user if valid. */
function optionalAuth(req, _res, next) {
  try {
    const allowed = getAllowedKeys();
    if (allowed.length === 0) return next(); // no auth configured

    const token = parseBearer(req) || req.query?.api_key || req.headers["x-api-key"];
    if (token && allowed.includes(String(token))) {
      req.user = { apiKey: String(token) };
    }
    return next();
  } catch (e) {
    return next(e);
  }
}

/** Express middleware: require API key if YUNA_API_KEYS is set. */
function requireApiKey(req, res, next) {
  const allowed = getAllowedKeys();
  if (allowed.length === 0) return next(); // open mode

  const token = parseBearer(req) || req.query?.api_key || req.headers["x-api-key"];
  if (!token || !allowed.includes(String(token))) {
    return res.status(401).json({
      ok: false,
      error: "unauthorized",
      message:
        "Missing or invalid API key. Provide Bearer token, ?api_key=, or X-API-Key header.",
    });
  }
  req.user = { apiKey: String(token) };
  return next();
}

module.exports = {
  parseBearer,
  optionalAuth,
  requireApiKey,
  getAllowedKeys,
};
