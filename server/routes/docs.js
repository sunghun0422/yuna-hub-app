// /server/routes/docs.js
// Serves static plugin documentation and OpenAPI references

const express = require("express");
const path = require("path");

const router = express.Router();

router.get("/docs", (req, res) => {
  const docsPath = path.join(__dirname, "../../public/.well-known/openapi.yaml");
  res.type("text/yaml");
  res.sendFile(docsPath);
});

router.get("/plugin", (req, res) => {
  const pluginPath = path.join(__dirname, "../../public/.well-known/ai-plugin.json");
  res.type("application/json");
  res.sendFile(pluginPath);
});

module.exports = router;
