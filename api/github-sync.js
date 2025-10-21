export default async function handler(req, res) {
  try {
    const token = process.env.GH_TOKEN;

    if (!token) {
      return res.status(500).json({
        ok: false,
        message: "Missing GH_TOKEN in environment variables.",
      });
    }

    // POST 요청에서 body 파싱
    const body = req.method === "POST" ? req.body : {};
    const repo = body.repo || "sunghun0422/yuna-hub-app";
    const branch = body.branch || "dev_v13";
    const path = body.path || "";

    // 요청할 GitHub API URL 생성
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`;

    // ✅ 디버깅 로그 출력
    console.log("[DEBUG] Fetch URL:", apiUrl);
    console.log("[DEBUG] Token present:", !!token, "Length:", token.length);
    console.log("[DEBUG] Method:", req.method);
    console.log("[DEBUG] Body:", body);

    // GitHub API 요청
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const contentType = response.headers.get("content-type");
    let responseData;
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    // 에러 응답인 경우 상세 정보 포함 반환
    if (!response.ok) {
      console.error("[DEBUG] GitHub API Error:", responseData);
      return res.status(response.status).json({
        ok: false,
        message: `GitHub API error: ${response.statusText}`,
        detail: responseData,
      });
    }

    // 파일 리스트 파싱
    const files = Array.isArray(responseData)
      ? responseData.map((f) => f.name)
      : [responseData.name || "No files"];

    return res.status(200).json({
      ok: true,
      repo,
      branch,
      path: path || "(root)",
      count: files.length,
      files,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Server Exception:", error);
    return res.status(500).json({
      ok: false,
      message: error.message || "Unexpected server error.",
    });
  }
}
