import { prisma } from "@/lib/prisma";
import {
  readTwilioForm,
  validateTwilioSignature,
  webhookUrl,
} from "@/lib/twilio";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Recording callback. Stores only the RecordingSid — never the raw
 * public Twilio media URL — so recordings can only be reached through
 * the authenticated proxy at /api/dialer/recordings/[sid].
 */
export async function POST(req: Request) {
  const params = await readTwilioForm(req);
  const signature = req.headers.get("X-Twilio-Signature");

  if (
    !validateTwilioSignature(
      signature,
      webhookUrl("/api/twilio/recording"),
      params,
    )
  ) {
    return new Response("Forbidden", { status: 403 });
  }

  const recordingSid = params.RecordingSid;
  // For <Dial record>, the recording belongs to the parent (client) leg.
  const callSid = params.CallSid;

  if (recordingSid && callSid) {
    await prisma.call.updateMany({
      where: { callSid },
      data: { recordingSid },
    });
  }

  return new Response("", { status: 204 });
}
