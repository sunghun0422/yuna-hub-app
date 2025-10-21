import { Buffer } from "buffer";

export default async function handler(req, res) {
  try {
    const { repo, branch, path, content } = req.body;

    console.log("📩 Incoming Request:", { repo, branch, path });
    console.log("🔥 GH_TOKEN:", process.env.GH_TOKEN);

    const url = `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`;
    const encodedContent = Buffer.from(content).toString("base64");

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `token ${process.env.GH_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Update via API",
        content: encodedContent,
        branch: branch,
      }),
    });

    const responseBody = await response.text();

    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} - ${response.statusText} - ${responseBody}`
      );
    }

    const data = JSON.parse(responseBody);
    return res.status(200).json({ ok: true, data });
  } catch (err) {
    console.error("❌ Error in /api/github-sync:", err);
    res.status(500).json({
      ok: false,
      message: "Server error in /api/github-sync",
      error: err.message,
      stack: err.stack,
    });
  }
}
