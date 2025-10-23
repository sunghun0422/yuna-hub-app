// /api/github-sync.js

import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method Not Allowed' });
  }

  try {
    const { repo, branch, commit_message, content, path } = req.body;
    if (!repo || !branch || !path || !content) {
      return res.status(400).json({ ok: false, message: 'Missing required fields' });
    }

    const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;
    const getRes = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.GH_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const fileData = await getRes.json();
    const sha = fileData.sha || undefined;

    const updateRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.GH_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        message: commit_message || 'Update via Yuna Hub',
        content: Buffer.from(content).toString('base64'),
        branch,
        sha
      })
    });

    const result = await updateRes.json();
    res.status(200).json({ ok: true, result });
  } catch (err) {
    console.error('Sync Error:', err);
    res.status(500).json({ ok: false, message: err.message });
  }
}
