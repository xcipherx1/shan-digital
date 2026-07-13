import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "@/auth.config";
import { prisma } from "@/lib/prisma";
import {
  getClientIp,
  isRateLimited,
  recordAttempt,
  LOCK_MS,
  MAX_CONSECUTIVE_FAILURES,
} from "@/lib/rate-limit";

// Computed once per cold start. Used to keep bcrypt.compare timing
// constant when the user does not exist, so login timing never leaks
// which emails are registered.
const DUMMY_HASH = bcrypt.hashSync("timing-safety-dummy-value", 12);

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(1).max(200),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw, request) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const email = parsed.data.email.toLowerCase();
        const { password } = parsed.data;
        const ip = getClientIp(request);

        // Sliding-window rate limit by email + IP.
        if (await isRateLimited(email, ip)) {
          await recordAttempt(email, ip, false);
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email } });

        // Unknown user: still run a compare (timing) then fail generically.
        if (!user) {
          await bcrypt.compare(password, DUMMY_HASH);
          await recordAttempt(email, ip, false);
          return null;
        }

        // Locked account: fail without revealing the reason.
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          await bcrypt.compare(password, DUMMY_HASH);
          await recordAttempt(email, ip, false);
          return null;
        }

        // Deactivated account.
        if (!user.isActive) {
          await bcrypt.compare(password, DUMMY_HASH);
          await recordAttempt(email, ip, false);
          return null;
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
          const failedAttempts = user.failedAttempts + 1;
          const shouldLock = failedAttempts >= MAX_CONSECUTIVE_FAILURES;
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedAttempts,
              lockedUntil: shouldLock
                ? new Date(Date.now() + LOCK_MS)
                : user.lockedUntil,
            },
          });
          await recordAttempt(email, ip, false);
          return null;
        }

        // Success: clear failure counters and audit.
        await prisma.user.update({
          where: { id: user.id },
          data: { failedAttempts: 0, lockedUntil: null },
        });
        await recordAttempt(email, ip, true);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "agent" | "admin") ?? "agent";
      }
      return session;
    },
  },
});
