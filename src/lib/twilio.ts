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
 * The exact URL Twilio requested, reconstructed from the proxy headers
 * Vercel sets. Twilio signs the URL it was configured with — the URL it
 * actually hits — so validating against this stays correct even when
 * PUBLIC_BASE_URL is missing a slash, uses another domain, etc.
 */
export function requestedUrl(req: Request): string {
  const url = new URL(req.url);
  const proto =
    req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    url.protocol.replace(":", "");
  const host =
    req.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    req.headers.get("host") ||
    url.host;
  return `${proto}://${host}${url.pathname}${url.search}`;
}

/**
 * Validate an incoming Twilio webhook signature against the raw POST
 * params. Without this, anyone who discovers a webhook URL could bill
 * calls to the account. Tries the URL Twilio actually requested first,
 * then the env-configured URL, and logs loudly on failure so a
 * misconfiguration shows up in Vercel logs instead of failing silently.
 */
export function validateTwilioWebhook(
  req: Request,
  path: string,
  params: Record<string, string>,
): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const signature = req.headers.get("X-Twilio-Signature");
  if (!authToken || !signature) {
    console.error(
      `[twilio] ${path}: missing ${authToken ? "signature header" : "TWILIO_AUTH_TOKEN"}.`,
    );
    return false;
  }

  const candidates = [...new Set([requestedUrl(req), webhookUrl(path)])];
  for (const url of candidates) {
    try {
      if (twilio.validateRequest(authToken, signature, url, params)) {
        return true;
      }
    } catch {
      // fall through to the next candidate
    }
  }

  console.error(
    `[twilio] ${path}: signature validation failed. Tried URLs: ${candidates.join(
      ", ",
    )}. Check that the TwiML App / status callback URLs match the deployed domain and that TWILIO_AUTH_TOKEN is correct.`,
  );
  return false;
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
