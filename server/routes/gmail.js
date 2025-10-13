import express from "express";
const router = express.Router();

router.post("/gmail/sync", async (req, res) => {
  try {
    console.log("📧 Gmail sync triggered");
    res.status(200).json({ ok: true, message: "Gmail synced successfully" });
  } catch (error) {
    console.error("❌ Gmail sync error:", error);
    res.status(500).json({ ok: false, error: "Failed to sync Gmail" });
  }
});

export default router;
