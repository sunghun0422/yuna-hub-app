import { ok, err } from "../lib/util.js";

export default async function (req, res) {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json(err("❗️ text 파라미터가 필요합니다."));
    }

    // 간단한 더미 요약 처리 (실제 요약 X)
    const summary = text.length > 100 ? text.slice(0, 100) + "..." : text;

    return res.json(ok({ summary }));
  } catch (error) {
    console.error("summarize error:", error);
    return res.status(500).json(err("서버 오류 발생"));
  }
}
