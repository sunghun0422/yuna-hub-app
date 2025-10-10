// api/health.js
export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    service: "yuna-hub",
    version: "1.0.0",
    env: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString()
  });
}
