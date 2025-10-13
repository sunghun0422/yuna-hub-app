import express from "express";
const router = express.Router();

// 임시 메모리 DB (추후 DB로 확장 가능)
let memoryStore = [];

// 기억 저장
router.post("/save", (req, res) => {
  const { key, value } = req.body;
  if (!key || !value)
    return res.status(400).json({ error: "key와 value를 모두 입력해야 합니다." });

  memoryStore.push({ key, value, savedAt: new Date() });
  res.json({ success: true, message: "기억이 저장되었습니다.", data: { key, value } });
});

// 기억 불러오기
router.get("/load", (req, res) => {
  const { key } = req.query;
  if (key) {
    const found = memoryStore.find((item) => item.key === key);
    if (!found) return res.status(404).json({ error: "해당 key를 찾을 수 없습니다." });
    return res.json(found);
  }
  res.json({ all: memoryStore });
});

export default router;
