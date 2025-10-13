import express from "express";
const router = express.Router();

router.post("/summarize", (req, res) => {
  res.json({ ok: true, message: "Storybook summarized successfully!" });
});

export default router;
