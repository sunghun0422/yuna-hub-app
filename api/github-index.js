export default function handler(req, res) {
  if (req.url === "/api" || req.url === "/api/") {
    return res.status(200).json({
      ok: true,
      message: "Yuna Hub v13 API active",
      routes: { health: "/api/health" },
      timestamp: new Date().toISOString()
    });
  }
  return res.status(404).json({ ok: false, message: "Not Found" });
}
