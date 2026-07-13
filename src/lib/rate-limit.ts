import { prisma } from "@/lib/prisma";

/** Sliding-window login rate limiting + audit, backed by LoginAttempt. */

export const RATE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const MAX_ATTEMPTS_PER_EMAIL = 5;
export const MAX_ATTEMPTS_PER_IP = 20;
export const LOCK_MS = 15 * 60 * 1000; // account lock duration
export const MAX_CONSECUTIVE_FAILURES = 5;

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * True when the email or IP has exceeded the failed-attempt window cap.
 * Counts only failures so a legitimate successful login never counts
 * against the user.
 */
export async function isRateLimited(
  email: string,
  ip: string,
): Promise<boolean> {
  const since = new Date(Date.now() - RATE_WINDOW_MS);

  const [emailFailures, ipFailures] = await Promise.all([
    prisma.loginAttempt.count({
      where: { email: email.toLowerCase(), success: false, createdAt: { gte: since } },
    }),
    prisma.loginAttempt.count({
      where: { ip, success: false, createdAt: { gte: since } },
    }),
  ]);

  return (
    emailFailures >= MAX_ATTEMPTS_PER_EMAIL || ipFailures >= MAX_ATTEMPTS_PER_IP
  );
}

export async function recordAttempt(
  email: string,
  ip: string,
  success: boolean,
): Promise<void> {
  await prisma.loginAttempt.create({
    data: { email: email.toLowerCase(), ip, success },
  });
}
