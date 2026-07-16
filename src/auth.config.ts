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
    // Rolling 1-hour window: the cookie is re-issued on activity, so an
    // active agent stays signed in, but any session left idle for an
    // hour expires server-side. A client idle-timer (IdleLogout) also
    // signs out open tabs after 60 minutes without interaction.
    maxAge: 60 * 60,
  },
  providers: [],
} satisfies NextAuthConfig;
