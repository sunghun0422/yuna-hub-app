// api/health/index.js
// Vercel serverless function (CommonJS)
module.exports = (req, res) => {
  res.status(200).json({
    ok: true,
    service: "yuna-hub",
    version: "1.0.0",
    env: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString()
  });
};
