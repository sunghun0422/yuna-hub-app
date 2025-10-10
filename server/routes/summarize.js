import { ok } from "../lib/util.js";

export default async (req, res) => {
  const text = req.body?.text || "기본 요약 테스트 문장입니다.";

  const summary = `요약: ${text.slice(0, 10)}...`; // 간단 요약 예시

  return res.json(ok({
    original: text,
    summary
  }));
};
