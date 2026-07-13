import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  readTwilioForm,
  validateTwilioSignature,
  webhookUrl,
} from "@/lib/twilio";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TERMINAL = new Set([
  "completed",
  "busy",
  "failed",
  "no-answer",
  "canceled",
]);

/**
 * Status callback — the single source of truth for call outcomes. The
 * browser is never trusted to report what happened on a call.
 */
export async function POST(req: Request) {
  const params = await readTwilioForm(req);
  const signature = req.headers.get("X-Twilio-Signature");

  if (
    !validateTwilioSignature(signature, webhookUrl("/api/twilio/status"), params)
  ) {
    return new Response("Forbidden", { status: 403 });
  }

  // The parent (client) leg SID is the key we stored the row under.
  const parentSid = params.ParentCallSid || params.CallSid;
  if (!parentSid) {
    return new Response("", { status: 204 });
  }

  // Prefer the Dial action outcome; fall back to the leg's own status.
  const status = params.DialCallStatus || params.CallStatus || undefined;
  const durationRaw = params.DialCallDuration || params.CallDuration;
  const duration = durationRaw ? parseInt(durationRaw, 10) : undefined;
  const price =
    params.Price && params.Price.trim() !== ""
      ? Math.abs(parseFloat(params.Price))
      : undefined;

  const isTerminal = status ? TERMINAL.has(status) : false;

  const data: Prisma.CallUpdateManyMutationInput = {};
  if (status) data.status = status;
  if (duration !== undefined && !Number.isNaN(duration))
    data.durationSeconds = duration;
  if (price !== undefined && !Number.isNaN(price)) data.priceUsd = price;
  if (params.DialCallSid) data.parentCallSid = params.DialCallSid;
  if (status === "in-progress" || status === "answered") {
    data.startedAt = new Date();
  }
  if (isTerminal) data.endedAt = new Date();

  // updateMany is a no-op (0 rows) if the row is missing, avoiding any
  // FK error — the voice route always creates the row first.
  if (Object.keys(data).length > 0) {
    await prisma.call.updateMany({
      where: { callSid: parentSid },
      data,
    });
  }

  return new Response("", { status: 204 });
}
