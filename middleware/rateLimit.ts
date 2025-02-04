import type { Context } from 'hono';

const WINDOW_MS = 3600000; // 1 hour
const MAX_REQUESTS = 10; // 10 attempts per hour

const attempts = new Map<string, { count: number; firstAttempt: number }>();

export async function rateLimitVerification(
  c: Context,
  next: () => Promise<void>
) {
  const ip = c.req.header('x-forwarded-for') || 'unknown';
  const now = Date.now();

  const attempt = attempts.get(ip) || { count: 0, firstAttempt: now };

  if (now - attempt.firstAttempt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAttempt: now });
  } else if (attempt.count >= MAX_REQUESTS) {
    return c.json({ error: 'Too many verification attempts' }, 429);
  } else {
    attempts.set(ip, { ...attempt, count: attempt.count + 1 });
  }

  await next();
}
