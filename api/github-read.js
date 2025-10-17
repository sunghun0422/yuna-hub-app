export default async function handler(req, res) {
  try {
    return res.status(200).json({
      ok: true,
      message: "github-read.js executed ✅",
      env: process.env.GH_TOKEN ? "GH_TOKEN loaded ✅" : "GH_TOKEN missing ⚠️",
      node: process.version,
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
