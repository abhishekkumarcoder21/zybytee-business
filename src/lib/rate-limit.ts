const windowMs = 4000;
const lastHit: Record<string, number> = {};

export function isRateLimited(key: string) {
  const now = Date.now();
  const last = lastHit[key] ?? 0;
  if (now - last < windowMs) return true;
  lastHit[key] = now;
  return false;
}
