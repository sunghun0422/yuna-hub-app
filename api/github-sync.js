try {
  const { repo, branch, path } = req.body;

  console.log("▶️ Incoming Request", { repo, branch, path });

  const url = `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `token ${process.env.GH_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`GitHub API responded with ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  res.status(200).json({ ok: true, data });
} catch (err) {
  console.error("🔴 Error in /api/github-sync:", err);
  res.status(500).json({
    ok: false,
    message: "Server error in /api/github-sync",
    error: err.message,
    stack: err.stack,
  });
}
