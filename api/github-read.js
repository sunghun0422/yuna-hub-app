// /api/github-read.js (임시 테스트 버전)
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), "public", "test", "data", "05-versions-space.pdf");

    if (!fs.existsSync(filePath)) {
      console.warn("⚠️ No PDF found at:", filePath);
      return res.status(200).json({
        ok: true,
        message: "PDF not found, but API is working fine ✅",
        hint: "Put the file in /public/test/data/05-versions-space.pdf to fully enable reading.",
        timestamp: new Date().toISOString()
      });
    }

    const pdfBuffer = fs.readFileSync(filePath);

    return res.status(200).json({
      ok: true,
      message: "PDF loaded successfully ✅",
      size: pdfBuffer.length,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error("🔥 Error in /api/github-read:", err);
    return res.status(500).json({
      ok: false,
      error: err.message
    });
  }
}
