// /server/routes/calendar.js
// Demo calendar route (stub for later Google Calendar integration)

const express = require("express");
const { jsonOK, asyncHandler } = require("../lib/util");
const { optionalAuth } = require("../lib/auth");

const router = express.Router();

/**
 * GET /api/calendar/upcoming
 * Query: ?limit=number
 */
router.get(
  "/calendar/upcoming",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit || 3);

    const sample = [
      {
        title: "Team Sync Meeting",
        start: "2025-10-11T10:00:00Z",
        end: "2025-10-11T11:00:00Z",
        location: "Budapest HQ",
      },
      {
        title: "FLEX Speaking Review",
        start: "2025-10-12T08:30:00Z",
        end: "2025-10-12T09:30:00Z",
        location: "Online",
      },
      {
        title: "KOTRA Smart City Forum Prep",
        start: "2025-10-14T13:00:00Z",
        end: "2025-10-14T15:00:00Z",
        location: "Embassy Conference Room",
      },
    ];

    return jsonOK(res, { events: sample.slice(0, limit) });
  })
);

module.exports = router;
