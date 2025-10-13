import express from "express";
const router = express.Router();

router.post("/sync", (req, res) => {
  res.json({ ok: true, message: "Memory synced successfully!" });
});

export default router;
