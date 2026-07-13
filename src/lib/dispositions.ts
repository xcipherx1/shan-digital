/** Call outcome dispositions, shared by the dialer UI and the API. */
export const DISPOSITIONS = [
  "Interested",
  "Callback",
  "Not interested",
  "No answer",
  "Voicemail",
  "Wrong number",
] as const;

export type Disposition = (typeof DISPOSITIONS)[number];

export function isDisposition(value: unknown): value is Disposition {
  return (
    typeof value === "string" &&
    (DISPOSITIONS as readonly string[]).includes(value)
  );
}
