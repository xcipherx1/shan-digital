import twilio from "twilio";

/** Shared Twilio helpers for the server-side routes. */

export function publicBaseUrl(): string {
  const url = process.env.PUBLIC_BASE_URL ?? process.env.NEXTAUTH_URL ?? "";
  return url.replace(/\/$/, "");
}

/** Absolute, signature-stable URL for a webhook path. */
export function webhookUrl(path: string): string {
  return `${publicBaseUrl()}${path}`;
}

/**
 * Validate an incoming Twilio webhook signature against the raw POST
 * params and the exact public URL. Without this, anyone who discovers a
 * webhook URL could bill calls to the account.
 */
export function validateTwilioSignature(
  signature: string | null,
  url: string,
  params: Record<string, string>,
): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken || !signature) return false;
  try {
    return twilio.validateRequest(authToken, signature, url, params);
  } catch {
    return false;
  }
}

/** Parse a Twilio form-encoded webhook body into a plain params object. */
export async function readTwilioForm(
  req: Request,
): Promise<Record<string, string>> {
  const form = await req.formData();
  const params: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    params[key] = typeof value === "string" ? value : "";
  }
  return params;
}

/** Server-side Twilio REST client (uses the auth token — never client-side). */
export function twilioClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) {
    throw new Error("Twilio account credentials are not configured.");
  }
  return twilio(sid, token);
}

/** Extract the user id from a Twilio client identity like `agent_<id>`. */
export function userIdFromIdentity(from: string | undefined): string | null {
  if (!from) return null;
  // From arrives as `client:agent_<userId>` on the voice webhook.
  const match = from.match(/agent_([A-Za-z0-9_-]+)$/);
  return match ? match[1]! : null;
}

export const AGENT_IDENTITY_PREFIX = "agent_";
