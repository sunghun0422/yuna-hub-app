export function ok(data = {}) {
  return { ok: true, ...data };
}

export function err(message = "error") {
  return { ok: false, error: message };
}
