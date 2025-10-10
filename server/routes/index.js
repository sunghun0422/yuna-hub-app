// /server/routes/index.js
// Root + health check routes

const express = require("express");
const { jsonOK, healthPayload } = require("../lib/util");
const { optionalAuth } = require("../lib/auth");

const router = express.Router();

router.get("/", optionalAuth, (req, res) => {
  return jsonOK(res, {
    message: "Yuna Hub API is running.",
    user: req.user || null,
  });
});

router.get("/health", (req, res) => {
  return jsonOK(res, healthPayload());
});

module.exports = router;
