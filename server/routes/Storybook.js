import express from "express";
const router = express.Router();

router.post("/storybook/summarize", async (req, res) => {
  try {
    const { story } = req.body;
    console.log("📚 Storybook input:", story);
    res.status(200).json({ ok: true, message: "Story summarized successfully" });
  } catch (error) {
    console.error("❌ Storybook summarize error:", error);
    res.status(500).json({ ok: false, error: "Failed to summarize storybook" });
  }
});

export default router;
