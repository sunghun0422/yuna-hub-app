const express = require("express");
const calendar = require("./calendar.js");

const router = express.Router();

router.get("/calendar-daily", calendar);

module.exports = router;
