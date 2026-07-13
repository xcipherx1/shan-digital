import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Authenticated recording proxy. The raw Twilio media URL is never
 * exposed; instead we verify the session, confirm the recording belongs
 * to the caller (or they are admin), then stream the audio from Twilio
 * using server-side credentials.
 */
export async function GET(
  _req: Request,
  context: { params: Promise<{ sid: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { sid } = await context.params;
  if (!/^RE[a-zA-Z0-9]+$/.test(sid)) {
    return new Response("Invalid recording id", { status: 400 });
  }

  const call = await prisma.call.findFirst({
    where: { recordingSid: sid },
    select: { userId: true },
  });
  if (!call) {
    return new Response("Not found", { status: 404 });
  }
  if (call.userId !== session.user.id && session.user.role !== "admin") {
    return new Response("Forbidden", { status: 403 });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) {
    return new Response("Recording service unavailable", { status: 503 });
  }

  const mediaUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Recordings/${sid}.mp3`;
  const basic = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  const upstream = await fetch(mediaUrl, {
    headers: { Authorization: `Basic ${basic}` },
    cache: "no-store",
  });

  if (!upstream.ok || !upstream.body) {
    return new Response("Recording not available", { status: 502 });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "private, no-store",
      "Content-Disposition": `inline; filename="${sid}.mp3"`,
    },
  });
}
