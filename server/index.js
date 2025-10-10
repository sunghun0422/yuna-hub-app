// /server/index.js
// Main entry point for Yuna Hub server

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { logger, env } = require("./lib/util");

// Routers
const base = require("./routes/index");
const summarize = require("./routes/summarize");
const docs = require("./routes/docs");
const calendar = require("./routes/calendar");

const app = express();
const log = logger("server");

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "1mb" }));

// Mount routes
app.use("/", base);
app.use("/api", summarize);
app.use("/api", calendar);
app.use("/", docs);

// Error handler
app.use((err, req, res, next) => {
  log.error("Unhandled error:", err);
  res.status(500).json({
    ok: false,
    error: "internal_error",
    message: err?.message || "Unexpected error",
  });
});

// Start server (only if not running under Vercel)
if (require.main === module) {
  const port = env.PORT;
  app.listen(port, () => {
    log.info(`Yuna Hub server running on port ${port}`);
  });
}

module.exports = app;
