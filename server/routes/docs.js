// server/docs.js
export default function handler(req, res) {
  if (req.method === 'GET') {
    res.json({ files: ['태생방.pdf', '기억방.pdf', '여시방1.pdf'] });
  } else {
    res.status(405).end();
  }
}
