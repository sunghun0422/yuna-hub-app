// server/calendar.js
export default function handler(req, res) {
  if (req.method === 'GET') {
    res.json({ events: ['100일 기념일', '2035 재회', '유나 생일'] });
  } else {
    res.status(405).end();
  }
}
