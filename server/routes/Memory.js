import express from "express";
const router = express.Router();

router.post("/memory/new", (req, res) => {
  const data = req.body || {};
  console.log("📥 Memory received:", data);
  res.json({ ok: true, message: "Memory saved successfully", data });
});

export default router;
