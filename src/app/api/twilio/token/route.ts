import { NextResponse } from "next/server";
import twilio from "twilio";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AGENT_IDENTITY_PREFIX } from "@/lib/twilio";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TTL_SECONDS = 3600;

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const apiKeySid = process.env.TWILIO_API_KEY_SID;
  const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;
  const twimlAppSid = process.env.TWILIO_TWIML_APP_SID;

  if (!accountSid || !apiKeySid || !apiKeySecret || !twimlAppSid) {
    return NextResponse.json(
      { error: "Voice service is not configured." },
      { status: 503 },
    );
  }

  // Confirm the account is still active before issuing a token.
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isActive: true, recordingEnabled: true },
  });
  if (!user?.isActive) {
    return NextResponse.json({ error: "Account is disabled." }, { status: 403 });
  }

  // Identity is derived from the user id, never the email, and is not guessable.
  const identity = `${AGENT_IDENTITY_PREFIX}${session.user.id}`;

  const AccessToken = twilio.jwt.AccessToken;
  const VoiceGrant = AccessToken.VoiceGrant;

  const token = new AccessToken(accountSid, apiKeySid, apiKeySecret, {
    identity,
    ttl: TTL_SECONDS,
  });

  token.addGrant(
    new VoiceGrant({
      outgoingApplicationSid: twimlAppSid,
      incomingAllow: false,
    }),
  );

  return NextResponse.json({
    token: token.toJwt(),
    identity,
    expiresAt: Date.now() + TTL_SECONDS * 1000,
    recordingEnabled: user.recordingEnabled,
  });
}
