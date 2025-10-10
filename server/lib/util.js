// server/lib/util.js
export function jsonResponse(res, status, data) {
  res.status(status).json(data);
}
