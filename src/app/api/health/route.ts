import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * TEMPORARY deployment diagnostic — reports which env vars exist
 * (presence only, never values) and whether the database is reachable.
 * Remove once the dialer is confirmed working in production.
 */
export async function GET() {
  const env = {
    DATABASE_URL: Boolean(process.env.DATABASE_URL),
    AUTH_SECRET: Boolean(process.env.AUTH_SECRET),
    NEXTAUTH_URL: Boolean(process.env.NEXTAUTH_URL),
    TWILIO_ACCOUNT_SID: Boolean(process.env.TWILIO_ACCOUNT_SID),
    TWILIO_AUTH_TOKEN: Boolean(process.env.TWILIO_AUTH_TOKEN),
    TWILIO_API_KEY_SID: Boolean(process.env.TWILIO_API_KEY_SID),
    TWILIO_API_KEY_SECRET: Boolean(process.env.TWILIO_API_KEY_SECRET),
    TWILIO_TWIML_APP_SID: Boolean(process.env.TWILIO_TWIML_APP_SID),
    TWILIO_CALLER_ID: Boolean(process.env.TWILIO_CALLER_ID),
    PUBLIC_BASE_URL: Boolean(process.env.PUBLIC_BASE_URL),
  };

  let db: { ok: boolean; seededUsers?: number; error?: string };
  try {
    const users = await prisma.user.count();
    db = { ok: true, seededUsers: users };
  } catch (err) {
    // Prisma error messages may mention the DB host but never credentials;
    // truncate defensively anyway.
    const message = err instanceof Error ? err.message : String(err);
    db = { ok: false, error: message.replace(/\s+/g, " ").slice(0, 300) };
  }

  return NextResponse.json({ env, db });
}
