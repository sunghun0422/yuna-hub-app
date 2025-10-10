// /server/routes/summarize.js
// Summarization endpoint — simple example implementation.

const express = require("express");
const { jsonOK, jsonErr, asyncHandler, logger } = require("../lib/util");
const { requireApiKey } = require("../lib/auth");

const log = logger("summarize");
const router = express.Router();

/**
 * POST /api/summarize
 * Body: { text: string }
 */
router.post(
  "/summarize",
  requireApiKey,
  asyncHandler(async (req, res) => {
    const { text } = req.body || {};
    if (!text || typeof text !== "string") {
      return jsonErr(res, "Missing 'text' field", 400);
    }

    // Very simple summarizer (demo)
    const summary = text.length > 200 ? text.slice(0, 180) + "..." : text;

    log.info("Summarized text length:", text.length);
    return jsonOK(res, { summary });
  })
);

module.exports = router;
