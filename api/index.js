// /api/index.js
// Vercel serverless entry: wrap Express app in a handler function.

const app = require("../server/index");

module.exports = (req, res) => {
  return app(req, res);
};
