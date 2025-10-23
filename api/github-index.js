// /api/github-index.js

import fetch from 'node-fetch';

export default async function handler(req, res) {
if (req.method !== 'POST') {
return res.status(405).json({ ok: false, message: 'Method Not Allowed' });
}

try {
const { repo, branch, path } = req.body;
if (!repo || !branch) {
return res.status(400).json({ ok: false, message: 'Missing required fields: repo or branch' });
}

const url = `https://api.github.com/repos/${repo}/contents/${path || ''}?ref=${branch}`;  
const response = await fetch(url, {  
  headers: {  
    'Authorization': `Bearer ${process.env.GH_TOKEN}`,  
    'Accept': 'application/vnd.github.v3+json'  
  }  
});  

if (!response.ok) {  
  const errorText = await response.text();  
  return res.status(response.status).json({ ok: false, message: `GitHub API error: ${errorText}` });  
}  

const data = await response.json();  
res.status(200).json({ ok: true, data });

} catch (err) {
console.error('Error:', err);
res.status(500).json({ ok: false, message: err.message });
}
}
