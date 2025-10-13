import express from "express";
const router = express.Router();

router.post("/calendar/sync", (req, res) => {
  console.log("📅 Calendar sync triggered");
  res.json({ ok: true, message: "Calendar synced successfully" });
});

export default router;
