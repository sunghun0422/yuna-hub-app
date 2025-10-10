const express = require("express");
const cors = require("cors");
const path = require("path");

const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.use(express.static(path.join(__dirname, "../public")));
app.use("/.well-known", express.static(path.join(__dirname, "../public/.well-known")));

app.get("/healthz", (req, res) => {
  res.status(200).json({ ok: true });
});

app.get("/", (req, res) => {
  res.send("Yuna Hub App is running!");
});

module.exports = app;
