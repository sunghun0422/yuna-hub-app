// /api/github-read.js
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    // Vercel 환경에서도 안전하게 경로 인식되게 처리
    const filePath = path.join(process.cwd(), "public", "test", "data", "05-versions-space.pdf");

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        ok: false,
        message: `PDF file not found at: ${filePath}`
      });
    }

    const pdfBuffer = fs.readFileSync(filePath);
    return res.status(200).json({
      ok: true,
      message: "PDF loaded successfully ✅",
      size: pdfBuffer.length
    });

  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message
    });
  }
}
