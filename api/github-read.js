// api/github-read.js
import fs from "fs";
import path from "path";

/**
 * GitHub Read API Handler (Vercel Safe Version)
 * - Public 폴더 내의 리소스만 읽기 가능
 * - 모든 에러를 catch하여 FUNCTION_INVOCATION_FAILED 방지
 */
export default async function handler(req, res) {
  try {
    // ✅ 안전한 절대경로 생성
    const filePath = path.join(process.cwd(), "public", "test", "data", "05-versions-space.pdf");

    // ✅ 파일 존재 확인
    if (!fs.existsSync(filePath)) {
      console.error("❌ File not found:", filePath);
      return res.status(404).json({
        ok: false,
        message: "File not found in deployed environment.",
        path: filePath,
        hint: "Place the file under /public/test/data/ before deployment."
      });
    }

    // ✅ 파일 읽기
    const pdfBuffer = fs.readFileSync(filePath);

    return res.status(200).json({
      ok: true,
      message: "PDF loaded successfully ✅",
      size: pdfBuffer.length,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    // ✅ 모든 에러를 캡처하여 500 방지
    console.error("🔥 Error in /api/github-read:", err);

    return res.status(500).json({
      ok: false,
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : "hidden",
      timestamp: new Date().toISOString()
    });
  }
}
