import express from "express";
const router = express.Router();

router.post("/memory/new", async (req, res) => {
  try {
    const { content } = req.body;
    console.log("📥 Memory received:", content);
    res.status(200).json({ ok: true, message: "Memory saved successfully" });
  } catch (error) {
    console.error("❌ Memory save error:", error);
    res.status(500).json({ ok: false, error: "Failed to save memory" });
  }
});

export default router;
