export default function handler(req, res) {
  try {
    res.status(200).json({
      status: "healthy",
      message: "Yuna Hub v13 active",
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message || "Unknown" });
  }
}
