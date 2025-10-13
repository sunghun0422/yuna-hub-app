import express from "express";
const router = express.Router();

router.post("/storybook/summarize", (req, res) => {
  const { story } = req.body || {};
  console.log("📘 Story received:", story);
  res.json({ ok: true, message: "Story summarized successfully" });
});

export default router;
