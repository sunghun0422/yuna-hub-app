import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    // ✅ 절대경로: /public/test/data/05-versions-space.pdf
    const filePath = path.join(process.cwd(), "public", "test", "data", "05-versions-space.pdf");

    // ✅ 파일 존재 확인
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        ok: false,
        message: "File not found in deployed environment.",
        hint: "Place the file under /public/test/data/ before deployment.",
        path: filePath,
      });
    }

    const pdfBuffer = fs.readFileSync(filePath);

    return res.status(200).json({
      ok: true,
      message: "PDF loaded successfully ✅",
      size: pdfBuffer.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("🔥 Error in /api/github-read:", err);

    return res.status(500).json({
      ok: false,
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : "hidden",
      timestamp: new Date().toISOString(),
    });
  }
}
