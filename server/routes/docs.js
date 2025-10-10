export default async function docs(req, res) {
  const q = (req.query.q || "").toString();
  // 데모: 고정 응답
  const items = [
    { id: "1", title: "Hello world", snippet: "demo snippet", url: "https://example.com/hello" }
  ].filter(i => !q || i.title.toLowerCase().includes(q.toLowerCase()));

  res.json({ results: items });
}
