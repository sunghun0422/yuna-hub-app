import express from "express";
const router = express.Router();

// 스토리 요약 API (단순 텍스트 요약 버전)
router.post("/summarize", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "요약할 텍스트가 필요합니다." });

  // 단순 데모용 요약 로직
  const summary = text.length > 150 ? text.slice(0, 150) + "..." : text;

  res.json({
    success: true,
    summary,
    message: "스토리 요약이 완료되었습니다.",
  });
});

export default router;
