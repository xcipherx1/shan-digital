/**
 * Server-side validation for outbound numbers. The browser is never
 * trusted — every number is re-validated here before Twilio dials it.
 */

/** Prefixes that are premium-rate / service numbers we refuse to dial. */
const BLOCKED_UK_PREFIXES = ["+449", "+4487", "+4470"];

/** Allowed country prefixes, widenable via ALLOWED_DIAL_PREFIXES. */
export function allowedPrefixes(): string[] {
  const raw = process.env.ALLOWED_DIAL_PREFIXES ?? "+44";
  return raw
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
}

const E164 = /^\+[1-9]\d{6,14}$/;

export type DialCheck =
  | { ok: true; e164: string }
  | { ok: false; reason: string };

/**
 * Normalise loosely-formatted input to E.164. Handles spaces, dashes,
 * brackets, a leading `00` international prefix and a bare UK `0`.
 */
export function normaliseNumber(input: string): string {
  let n = (input ?? "").replace(/[\s()\-.]/g, "");
  if (n.startsWith("00")) n = "+" + n.slice(2);
  // Bare UK national format (07..., 020...) -> +44
  if (!n.startsWith("+") && n.startsWith("0")) n = "+44" + n.slice(1);
  if (!n.startsWith("+") && n.length > 0 && /^\d+$/.test(n)) n = "+" + n;
  return n;
}

/** Full validation used by the TwiML endpoint. */
export function validateDialTarget(input: string): DialCheck {
  const e164 = normaliseNumber(input);

  if (!E164.test(e164)) {
    return { ok: false, reason: "Number is not valid E.164 format." };
  }

  const prefixes = allowedPrefixes();
  if (!prefixes.some((p) => e164.startsWith(p))) {
    return {
      ok: false,
      reason: `Only ${prefixes.join(", ")} numbers are permitted.`,
    };
  }

  if (BLOCKED_UK_PREFIXES.some((p) => e164.startsWith(p))) {
    return {
      ok: false,
      reason: "Premium-rate and service numbers are blocked.",
    };
  }

  return { ok: true, e164 };
}
