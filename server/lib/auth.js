// server/lib/auth.js
export function isAuthorized(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  return token === process.env.AUTH_TOKEN;
}
