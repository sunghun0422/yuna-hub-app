// api/github-sync.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed. Use POST with a JSON body.",
    });
  }

  console.log("🟢 [github-sync] Function started");

  try {
    const { repo, branch, path, content, sha } = req.body || {};
    console.log("📩 Incoming request body:", { repo, branch, path, hasContent: !!content, hasSha: !!sha });

    if (!repo || !branch || !path) {
      return res.status(400).json({
        ok: false,
        error: "Missing required parameters: repo, branch and path are required.",
      });
    }

    const token = process.env.GH_TOKEN;
    if (!token) {
      console.error("❌ Missing GitHub token in environment");
      return res.status(500).json({
        ok: false,
        error: "Missing GitHub token (GH_TOKEN not found in environment variables)",
      });
    }

    const normalizedPath = path.toString().replace(/^\/+/, "").replace(/\/+$/, "");
    const encodedContent = Buffer.from(content || "").toString("base64");
    const url = `https://api.github.com/repos/${repo}/contents/${normalizedPath}`;
    console.log("🌍 Target URL:", url);

    const body = {
      message: `Update via Vercel API at ${new Date().toISOString()}`,
      content: encodedContent,
      branch,
    };

    if (sha) body.sha = sha;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const resultText = await response.text();
    console.log("📦 GitHub API raw response:", resultText);

    if (!response.ok) {
      console.error("❗ GitHub API Error", response.status, resultText);
      return res.status(response.status).json({
        ok: false,
        status: response.status,
        error: resultText,
      });
    }

    console.log("✅ File successfully synced to GitHub!");
    res.status(200).json({
      ok: true,
      message: "File successfully synced to GitHub",
      response: JSON.parse(resultText),
    });
  } catch (err) {
    console.error("💥 Unhandled error in github-sync:", err);
    res.status(500).json({
      ok: false,
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
}
