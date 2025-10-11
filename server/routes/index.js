import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Yuna Hub API Root" });
});

router.post("/summarize-url", (req, res) => {
  const { url } = req.body;
  res.json({ result: `Received URL: ${url}` });
});

export default router;
