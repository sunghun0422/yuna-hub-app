import express from "express";

const router = express.Router();

// ✅ 기본 테스트용 요약 엔드포인트
router.post("/summarize-url", (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL required" });
  }
  res.json({
    success: true,
    message: `URL ${url} summarized successfully.`,
  });
});

// ✅ Memory 저장 테스트용
router.post("/memory/save", (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content required" });
  }
  res.json({ success: true, message: "Memory saved successfully." });
});

// ✅ Storybook 요약 테스트용
router.post("/storybook/summarize", (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text required" });
  }
  res.json({ success: true, message: "Storybook summarized successfully." });
});

// ✅ Gmail 동기화 테스트용
router.post("/gmail/sync", (req, res) => {
  const { label } = req.body;
  if (!label) {
    return res.status(400).json({ error: "Label required" });
  }
  res.json({ success: true, message: `Gmail synced with label ${label}` });
});

export default router;
