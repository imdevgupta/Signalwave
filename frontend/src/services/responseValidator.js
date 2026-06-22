export function ensureArray(data) {
  return Array.isArray(data) ? data : [];
}

export function ensureObject(data) {
  return data && typeof data === "object" ? data : {};
}

export function ensureString(data) {
  return typeof data === "string" ? data : "";
}

export function ensureNumber(data) {
  return typeof data === "number" ? data : 0;
}
