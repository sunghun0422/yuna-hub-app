// server/routes/calendar.js

const express = require("express");
const { ok } = require("../lib/util.js");

const router = express.Router();

router.get("/calendar-daily", async (req, res) => {
  const date = req.query.date || new Date().toISOString().slice(0, 10);

  // TODO: Google Calendar OAuth 연동
  res.json(
    ok({
      date,
      items: [
        { time: "09:00", title: "팀 스탠드업", location: "Meet", note: "" },
        { time: "12:30", title: "점심 미팅", location: "TF 근처", note: "신과장/이과장" },
        { time: "16:00", title: "문서 검토", location: "Office", note: "보고서 초안" }
      ]
    })
  );
});

module.exports = router;
