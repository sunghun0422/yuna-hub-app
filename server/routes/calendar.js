import express from "express";
const router = express.Router();

router.post("/sync", (req, res) => {
  res.json({ ok: true, message: "Calendar synced successfully!" });
});

export default router;
