export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const { url, meta } = req.body || {};
    if (!url) {
      return res.status(400).json({ ok: false, error: "url is required" });
    }

    // 간단한 더미 요약 로직 (실제 요약기 연결 전용)
    const fakeSummary = `[stub] summary of ${url}`;
    return res.status(200).json({
      ok: true,
      summary: fakeSummary,
      source: url,
      meta: meta || null,
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    console.error("post_summarize_url error:", e);
    return res.status(500).json({ ok: false, error: e.message });
  }
}
