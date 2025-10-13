import express from "express";
const router = express.Router();

router.post("/new", (req, res) => {
  const data = req.body || {};
  res.json({ ok: true, message: "Memory saved successfully", data });
});

export default router;
