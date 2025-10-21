export default async function handler(req, res) {
  try {
    const { repo, branch, path, content } = req.body;

    console.log("📥 Incoming Request", { repo, branch, path });
    console.log("🔐 GH_TOKEN exists:", !!process.env.GH_TOKEN);

    const url = `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`;
    console.log("🌐 GitHub API URL:", url);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `token ${process.env.GH_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Add or update file via API",
        content: Buffer.from(content).toString("base64"),
        branch,
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error("❌ GitHub API Error:", response.status, responseText);
      throw new Error(`GitHub API Error: ${response.status}`);
    }

    const data = JSON.parse(responseText);
    console.log("✅ GitHub API Success:", data);

    res.status(200).json({ ok: true, data });
  } catch (err) {
    console.error("🔥 Server error in /api/github-sync:", err);
    res.status(500).json({
      ok: false,
      message: "Server error in /api/github-sync",
      error: err.message,
      stack: err.stack,
    });
  }
}
