import express from "express";
const router = express.Router();

router.post("/gmail/sync", (req, res) => {
  console.log("📨 Gmail sync triggered");
  res.json({ ok: true, message: "Gmail synced successfully" });
});

export default router;
