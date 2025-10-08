import { ok } from "../lib/util.js";

export default async (req, res) => {
  const { url } = req.body || {};
  if (!url) return res.status(400).json({ ok:false, error: "url_required" });
  // TODO: 실제 요약 로직(크롤/추출 + 요약) 연결
  return res.json(ok({
    title: `Summary of ${url}`,
    bullets: ["핵심 1","핵심 2","핵심 3"]
  }));
};
