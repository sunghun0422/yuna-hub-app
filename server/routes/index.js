// /server/routes/index.js
// Root + health check routes

const express = require("express");
const { jsonOK, healthPayload } = require("../lib/util");
const { optionalAuth } = require("../lib/auth");

const router = express.Router();

// Root
router.get("/", optionalAuth, (req, res) => {
  return jsonOK(res, {
    message: "Yuna Hub API is running.",
    user: req.user || null,
  });
});

// Health (root)
router.get("/health", (req, res) => {
  return jsonOK(res, healthPayload());
});

// --- 중요: /api 경유로도 바로 확인 가능하게 추가 ---
// Many deployments rewrite /api/* to the Express app.
// So expose the health check also under /api/health (and /api).
router.get("/api", (req, res) => {
  return jsonOK(res, { message: "Yuna Hub API is running (via /api)." });
});

router.get("/api/health", (req, res) => {
  return jsonOK(res, healthPayload());
});

module.exports = router;
