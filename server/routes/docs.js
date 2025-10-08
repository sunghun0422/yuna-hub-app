import { ok } from "../lib/util.js";

export default async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.json(ok({ results: [] }));
  // TODO: 사내 DB/Drive 검색 연결
  return res.json(ok({
    results: [
      {
        id: "doc_001",
        title: `검색결과: ${q}`,
        snippet: "문서 요약 또는 미리보기 텍스트",
        url: "https://example.com/docs/doc_001"
      }
    ]
  }));
};
