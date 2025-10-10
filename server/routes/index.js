// server/routes/index.js

const express = require("express");
const router = express.Router();

const calendarRoute = require("./calendar.js");
const docsRoute = require("./docs.js");
const summarizeRoute = require("./summarize.js");

router.use("/calendar-daily", calendarRoute);
router.use("/docs/search", docsRoute);
router.use("/summarize-url", summarizeRoute);

module.exports = router;
