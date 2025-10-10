export default async function calendar(req, res) {
  const date = (req.query.date || "").toString();
  // 데모: 고정 일정
  res.json({
    date: date || "2025-10-08",
    events: [
      { time: "09:00", title: "Standup" },
      { time: "14:00", title: "1:1 Meeting" }
    ]
  });
}
