import twilio from "twilio";
import { prisma } from "@/lib/prisma";
import { validateDialTarget } from "@/lib/dial-validation";
import {
  readTwilioForm,
  validateTwilioSignature,
  webhookUrl,
  userIdFromIdentity,
} from "@/lib/twilio";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const XML_HEADERS = { "Content-Type": "text/xml" };

function xml(body: string, status = 200): Response {
  return new Response(body, { status, headers: XML_HEADERS });
}

function reject(message: string): Response {
  const twiml = new twilio.twiml.VoiceResponse();
  twiml.say(message);
  twiml.hangup();
  return xml(twiml.toString());
}

function startOfUtcDay(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}

export async function POST(req: Request) {
  const params = await readTwilioForm(req);
  const signature = req.headers.get("X-Twilio-Signature");
  const url = webhookUrl("/api/twilio/voice");

  // Mandatory: reject anything not signed by Twilio.
  if (!validateTwilioSignature(signature, url, params)) {
    return new Response("Forbidden", { status: 403 });
  }

  const callerId = process.env.TWILIO_CALLER_ID;
  if (!callerId) {
    return reject("The dialer is not configured. Please contact support.");
  }

  // Identify the agent from the client identity, never trust a client field.
  const userId = userIdFromIdentity(params.From);
  if (!userId) {
    return reject("Your session could not be verified.");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.isActive) {
    return reject("Your account is not permitted to make calls.");
  }

  // Server-side number validation (E.164, allowed prefix, no premium/service).
  const check = validateDialTarget(params.To ?? "");
  if (!check.ok) {
    return reject(check.reason);
  }

  // Daily call limit.
  const callsToday = await prisma.call.count({
    where: { userId: user.id, createdAt: { gte: startOfUtcDay() } },
  });
  if (callsToday >= user.dailyCallLimit) {
    return reject("You have reached your daily call limit.");
  }

  // Create the call row up-front so history exists even if the call fails.
  const parentCallSid = params.CallSid;
  if (parentCallSid) {
    await prisma.call.upsert({
      where: { callSid: parentCallSid },
      create: {
        callSid: parentCallSid,
        userId: user.id,
        direction: "outbound",
        fromNumber: callerId,
        toNumber: check.e164,
        status: "initiated",
        startedAt: new Date(),
      },
      update: {},
    });
  }

  // Build the dial TwiML with absolute callback URLs (stable for signing).
  const twiml = new twilio.twiml.VoiceResponse();
  const dial = twiml.dial({
    callerId,
    answerOnBridge: true,
    timeout: 30,
    action: webhookUrl("/api/twilio/status"),
    method: "POST",
    ...(user.recordingEnabled
      ? {
          record: "record-from-answer-dual",
          recordingStatusCallback: webhookUrl("/api/twilio/recording"),
          recordingStatusCallbackMethod: "POST",
        }
      : {}),
  });
  dial.number(
    {
      statusCallback: webhookUrl("/api/twilio/status"),
      statusCallbackEvent: ["initiated", "ringing", "answered", "completed"],
      statusCallbackMethod: "POST",
    },
    check.e164,
  );

  return xml(twiml.toString());
}
