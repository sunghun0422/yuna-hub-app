export default function handler(req, res) {
  try {
    res.status(200).json({
      status: "healthy",
      message: "Yuna Hub API v13 active",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}
