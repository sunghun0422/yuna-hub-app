export default async function handler(req, res) {
  try {
    res.status(200).json({
      ok: true,
      service: "yuna-hub",
      env: process.env.VERCEL_ENV || "development",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({ ok: false, error: error.message });
  }
}
