// /server/lib/util.js
// Small utilities used across routes.

const pkg = (() => {
  try {
    // Lazy read to avoid issues during serverless cold starts
    return require("../../package.json");
  } catch {
    return { name: "yuna-hub", version: "0.0.0" };
  }
})();

/** Common JSON success shape */
function jsonOK(res, data = {}, status = 200) {
  return res.status(status).json({ ok: true, ...data });
}

/** Common JSON error shape */
function jsonErr(res, message = "error", status = 500, extra = {}) {
  return res.status(status).json({ ok: false, error: message, ...extra });
}

/** Async route wrapper (no external deps) */
function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/** Basic logger with namespace */
function logger(ns = "app") {
  const prefix = `[${ns}]`;
  return {
    info: (...a) => console.log(prefix, ...a),
    warn: (...a) => console.warn(prefix, ...a),
    error: (...a) => console.error(prefix, ...a),
    debug: (...a) => {
      if (process.env.DEBUG?.toLowerCase() === "true") console.log(prefix, ...a);
    },
  };
}

/** Safe JSON.parse */
function safeParseJSON(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

/** Environment helpers */
const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  isProd: () => (process.env.NODE_ENV || "development") === "production",
  isDev: () => (process.env.NODE_ENV || "development") !== "production",
  PORT: Number(process.env.PORT || 3000),
  SERVICE_NAME: process.env.SERVICE_NAME || pkg.name || "yuna-hub",
  SERVICE_VERSION: process.env.SERVICE_VERSION || pkg.version || "0.0.0",
};

/** Build a standard health payload (for /health) */
function healthPayload(extra = {}) {
  return {
    service: env.SERVICE_NAME,
    version: env.SERVICE_VERSION,
    node: process.version,
    env: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    ...extra,
  };
}

module.exports = {
  jsonOK,
  jsonE
