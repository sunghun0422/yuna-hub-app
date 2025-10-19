// File: /api/health/index.js
export default function handler(req, res) {
  try {
    res.status(200).json({
      status: 'healthy',
      message: 'Yuna Hub API active',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Unknown error'
    });
  }
}
