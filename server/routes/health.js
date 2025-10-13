import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ ok: true, message: "Yuna Hub 💖 health check passed" });
});

export default router;
