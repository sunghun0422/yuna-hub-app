import express from "express";
const router = express.Router();

// Gmail 메일 리스트 (더미 데이터)
router.get("/list", (req, res) => {
  res.json({
    success: true,
    emails: [
      { id: 1, subject: "회의 일정 확인", sender: "team@kotra.or.kr" },
      { id: 2, subject: "헝가리 프로젝트 자료", sender: "hipa@hungary.hu" },
    ],
  });
});

// Gmail 특정 메일 요약 (더미 버전)
router.post("/summarize", (req, res) => {
  const { subject } = req.body;
  if (!subject) return res.status(400).json({ error: "메일 제목(subject)이 필요합니다." });

  res.json({
    success: true,
    summary: `이 메일(${subject})은 핵심 정보를 포함하고 있으며 요약이 완료되었습니다.`,
  });
});

export default router;
