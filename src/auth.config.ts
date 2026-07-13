import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config shared by the middleware. It must NOT import
 * Prisma, bcrypt or any Node-only module — the middleware runs on the
 * Edge runtime and only needs to read the JWT session cookie.
 * The Credentials provider and DB logic live in `auth.ts` (Node only).
 */
export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/dialer/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },
  providers: [],
} satisfies NextAuthConfig;
