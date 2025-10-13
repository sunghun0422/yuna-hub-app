import express from "express";
const router = express.Router();

router.post("/summarize", (req, res) => {
  const story = req.body || {};
  res.json({ ok: true, message: "Story summarized successfully", story });
});

export default router;
