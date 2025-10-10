export default async function summarize(req, res) {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ ok: false, error: "Missing text to summarize." });
    }

    // 예시 요약 로직
    const summary = text.length > 100 ? text.slice(0, 97) + "..." : text;

    res.status(200).json({
      ok: true,
      summary,
    });
  } catch (error) {
    console.error("Summarization error:", error);
    res.status(500).json({ ok: false, error: "Internal Server Error" });
  }
}
