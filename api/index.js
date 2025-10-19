// File: /api/health/index.js
module.exports = (req, res) => {
  try {
    res.status(200).json({
      status: 'healthy',
      message: 'Yuna Hub API active (CommonJS mode)',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Unknown error'
    });
  }
};
