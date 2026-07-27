import { Resend } from "resend";
import { funnel } from "@/config/landing";
import type { Lead } from "@prisma/client";

/**
 * Resend notifications for the roofing funnel. All sends are
 * best-effort: a failed email must never fail the request that saved
 * the lead (the dashboard is the source of truth).
 */

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const wrap = (body: string) => `
<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#0a0b10;font-family:Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0b10;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#11131c;border-radius:16px;border:1px solid #23263a;">
          <tr><td style="padding:32px 32px 0;">
            <p style="margin:0;font-size:20px;font-weight:700;color:#edede6;">Shan<span style="color:#c9f73a;">.</span>
              <span style="font-size:10px;letter-spacing:2px;color:#9da3b4;text-transform:uppercase;"> Roofing Funnel</span>
            </p>
          </td></tr>
          <tr><td style="padding:24px 32px 32px;">${body}</td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

const row = (label: string, value: string) => `
  <tr>
    <td style="padding:7px 12px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#9da3b4;white-space:nowrap;vertical-align:top;">${label}</td>
    <td style="padding:7px 12px;font-size:14px;color:#edede6;">${value}</td>
  </tr>`;

function resendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

function sender(): string {
  return (
    process.env.RESEND_FROM_EMAIL ??
    "Shan Digital Marketing <onboarding@resend.dev>"
  );
}

function notifyAddress(): string {
  return (
    process.env.NOTIFY_EMAIL ??
    process.env.LEAD_NOTIFICATION_EMAIL ??
    funnel.email
  );
}

function answersTable(lead: Lead): string {
  const answers = (lead.answers ?? {}) as Record<string, string>;
  const entries = Object.entries(answers);
  if (entries.length === 0) return "";
  return entries
    .map(([k, v]) => row(esc(k.replace(/_/g, " ")), esc(String(v))))
    .join("");
}

/** Fired when Stage 1 (contact details) saves the lead. */
export async function sendNewLeadNotification(lead: Lead): Promise<void> {
  const resend = resendClient();
  if (!resend) {
    console.error("[leads] RESEND_API_KEY missing — notification skipped.");
    return;
  }
  const dashboardUrl = `${process.env.PUBLIC_BASE_URL ?? process.env.NEXTAUTH_URL ?? ""}/dashboard`;
  try {
    await resend.emails.send({
      from: sender(),
      to: notifyAddress(),
      replyTo: lead.email ?? undefined,
      subject: `New Roofing Lead: ${lead.businessName ?? lead.fullName ?? "Unknown"}`,
      html: wrap(`
        <h1 style="margin:0 0 8px;font-size:22px;color:#edede6;">New roofing lead</h1>
        <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#9da3b4;">
          Captured on /landing just now. Full detail in the
          <a href="${dashboardUrl}" style="color:#c9f73a;">dashboard</a>.
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0b10;border-radius:12px;border:1px solid #23263a;">
          ${row("Name", esc(lead.fullName ?? "—"))}
          ${row("Business", esc(lead.businessName ?? "—"))}
          ${row("Email", esc(lead.email ?? "—"))}
          ${row("Phone", esc(lead.phone ?? "—"))}
          ${row("Town", esc(lead.city ?? "—"))}
          ${row("Package", esc(lead.selectedOffer ?? "—"))}
          ${row("Pain point", esc(lead.painPoint ?? "—"))}
          ${answersTable(lead)}
          ${row("Source", esc([lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(" / ") || "direct"))}
        </table>`),
    });
  } catch (err) {
    console.error("[leads] New-lead notification failed:", err);
  }
}

/** Fired when Stage 2 marks the meeting booked. */
export async function sendBookingEmails(lead: Lead): Promise<void> {
  const resend = resendClient();
  if (!resend) {
    console.error("[leads] RESEND_API_KEY missing — booking emails skipped.");
    return;
  }
  const firstName = esc((lead.fullName ?? "there").split(" ")[0]!);
  const when = lead.meetingTime
    ? new Date(lead.meetingTime).toLocaleString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/London",
      })
    : null;

  // Confirmation to the lead — friendly, sets expectations.
  if (lead.email) {
    try {
      await resend.emails.send({
        from: sender(),
        to: lead.email,
        subject: "Your free website plan call is booked",
        html: wrap(`
          <h1 style="margin:0 0 8px;font-size:22px;color:#edede6;">You're booked in, ${firstName}.</h1>
          <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#9da3b4;">
            ${
              when
                ? `We'll call you on <strong style="color:#c9f73a;">${esc(when)}</strong>.`
                : `We'll be in touch within one working day to confirm your call time.`
            }
            It takes about 15 minutes: we'll look at how you get work today, what
            homeowners in your area search for, and which package fits.
          </p>
          <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#9da3b4;">
            No hard sell. You'll leave with a plan for your roofing business either way.
          </p>
          <p style="margin:0;font-size:14px;line-height:1.7;color:#9da3b4;">
            Speak soon,<br/>
            <strong style="color:#edede6;">${esc(funnel.brand)}</strong><br/>
            Bristol, United Kingdom
          </p>`),
      });
    } catch (err) {
      console.error("[leads] Booking confirmation failed:", err);
    }
  }

  // Update to the agency.
  try {
    await resend.emails.send({
      from: sender(),
      to: notifyAddress(),
      subject: `Booked: strategy call with ${lead.businessName ?? lead.fullName ?? "lead"}`,
      html: wrap(`
        <h1 style="margin:0 0 8px;font-size:22px;color:#edede6;">Strategy call booked</h1>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0b10;border-radius:12px;border:1px solid #23263a;">
          ${row("Name", esc(lead.fullName ?? "—"))}
          ${row("Business", esc(lead.businessName ?? "—"))}
          ${row("Phone", esc(lead.phone ?? "—"))}
          ${row("When", esc(when ?? "To be confirmed"))}
          ${row("Ref", esc(lead.meetingRef ?? "—"))}
        </table>`),
    });
  } catch (err) {
    console.error("[leads] Booking notify failed:", err);
  }
}
