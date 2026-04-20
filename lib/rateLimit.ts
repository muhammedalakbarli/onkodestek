const store = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS  = 60 * 60 * 1000; // 1 saat
const MAX_REQS   = 5;               // saatda max 5 müraciət

export function rateLimit(ip: string): { ok: boolean; remaining: number } {
  const now    = Date.now();
  const record = store.get(ip);

  if (!record || now > record.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, remaining: MAX_REQS - 1 };
  }

  if (record.count >= MAX_REQS) {
    return { ok: false, remaining: 0 };
  }

  record.count++;
  return { ok: true, remaining: MAX_REQS - record.count };
}
