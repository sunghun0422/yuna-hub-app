// server/lib/util.js

function ok(data) {
  return { ok: true, ...data };
}

function fail(message = "Something went wrong.") {
  return { ok: false, error: message };
}

module.exports = {
  ok,
  fail
};
