export function requireAuth(req, res, next) {
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!process.env.API_TOKEN || token !== process.env.API_TOKEN) {
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
}
