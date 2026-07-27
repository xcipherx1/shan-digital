/**
 * Lightweight sliding-window IP throttle for the PUBLIC lead endpoints.
 * In-memory per serverless instance — not perfect global limiting, but
 * combined with the honeypot field and zod validation it raises the
 * cost of abuse without adding a datastore round-trip to the hot path.
 */

const buckets = new Map<string, number[]>();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_WINDOW = 10;

export function isThrottled(ip: string, scope: string): boolean {
  const key = `${scope}:${ip}`;
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= MAX_PER_WINDOW) {
    buckets.set(key, hits);
    return true;
  }
  hits.push(now);
  buckets.set(key, hits);

  // Opportunistic cleanup so the map can't grow unbounded.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (v.every((t) => now - t >= WINDOW_MS)) buckets.delete(k);
    }
  }
  return false;
}
