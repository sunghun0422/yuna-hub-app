import fetch from "node-fetch";

export default async function summarize(req, res) {
  try {
    const { url } = req.body || {};
    if (!url) return res.status(400).json({ error: "url is required" });

    // 데모: 실제 요약 대신 URL만 에코
    return res.json({
      ok: true,
      summary: `This would summarize: ${url}`
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "internal_error" });
  }
}
