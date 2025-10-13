import express from "express";
const router = express.Router();

router.post("/calendar/sync", async (req, res) => {
  try {
    console.log("📅 Calendar sync triggered");
    res.status(200).json({ ok: true, message: "Calendar synced successfully" });
  } catch (error) {
    console.error("❌ Calendar sync error:", error);
    res.status(500).json({ ok: false, error: "Failed to sync Calendar" });
  }
});

export default router;
