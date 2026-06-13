import { site } from "@/config/site";
import type { Lead } from "@/lib/validation";

/** Minimal inline-styled HTML emails that render well in every client. */

const wrap = (body: string) => `
<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#0a0b10;font-family:Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0b10;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#11131c;border-radius:16px;border:1px solid #23263a;">
          <tr><td style="padding:32px 32px 0;">
            <p style="margin:0;font-size:20px;font-weight:700;color:#edede6;">Shan<span style="color:#c9f73a;">.</span>
              <span style="font-size:10px;letter-spacing:2px;color:#9da3b4;text-transform:uppercase;"> Digital Marketing</span>
            </p>
          </td></tr>
          <tr><td style="padding:24px 32px 32px;">${body}</td></tr>
          <tr><td style="padding:0 32px 28px;">
            <p style="margin:0;font-size:11px;line-height:1.6;color:#9da3b4;">
              ${site.name} · ${site.address.street}, ${site.address.postcode}, ${site.address.city}, ${site.address.country}<br/>
              <a href="mailto:${site.email}" style="color:#c9f73a;">${site.email}</a>
            </p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

const row = (label: string, value: string) => `
  <tr>
    <td style="padding:8px 12px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#9da3b4;white-space:nowrap;vertical-align:top;">${label}</td>
    <td style="padding:8px 12px;font-size:14px;color:#edede6;">${value}</td>
  </tr>`;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function leadNotificationEmail(lead: Lead) {
  const isAudit = lead.type === "audit";
  const details = isAudit
    ? row("Name", esc(lead.name)) +
      row("Email", esc(lead.email)) +
      row("Business", esc(lead.business)) +
      row("Area", esc(lead.location)) +
      row("Website", lead.website ? esc(lead.website) : "—")
    : row("Name", esc(lead.name)) +
      row("Email", esc(lead.email)) +
      row("Phone", esc(lead.phone)) +
      row("Goal", esc(lead.goal));

  return {
    subject:
      lead.type === "audit"
        ? `New audit request — ${lead.name} (${lead.business})`
        : `New strategy call request — ${lead.name}`,
    html: wrap(`
      <h1 style="margin:0 0 8px;font-size:22px;color:#edede6;">
        New ${isAudit ? "free audit" : "strategy call"} lead
      </h1>
      <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#9da3b4;">
        Submitted via the website lead magnet just now.
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0b10;border-radius:12px;border:1px solid #23263a;">
        ${details}
      </table>
      <p style="margin:20px 0 0;">
        <a href="mailto:${esc(lead.email)}" style="display:inline-block;background:#c9f73a;color:#14150f;font-size:14px;font-weight:700;padding:12px 24px;border-radius:999px;text-decoration:none;">
          Reply to ${esc(lead.name.split(" ")[0])}
        </a>
      </p>`),
  };
}

export function leadConfirmationEmail(lead: Lead) {
  const isAudit = lead.type === "audit";
  const firstName = esc(lead.name.split(" ")[0]);

  return {
    subject: isAudit
      ? "Your free Local SEO audit is underway"
      : "Your strategy call request — received",
    html: wrap(`
      <h1 style="margin:0 0 8px;font-size:22px;color:#edede6;">
        Thanks, ${firstName} — we're on it.
      </h1>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#9da3b4;">
        ${
          isAudit
            ? `We've received your audit request${
                "business" in lead ? ` for <strong style="color:#edede6;">${esc(lead.business)}</strong>` : ""
              }. A real human (not a robot) is reviewing your local rankings, Google Business Profile and competitor gap right now.`
            : `We've received your strategy call request. We'll reply within one working day to lock in a 15-minute slot that suits you.`
        }
      </p>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#9da3b4;">
        ${
          isAudit
            ? `Expect your personalised audit within <strong style="color:#c9f73a;">2 working days</strong> — including the exact fixes we'd prioritise first.`
            : `In the meantime, jot down your biggest growth frustration — that's where we'll start.`
        }
      </p>
      <p style="margin:0;font-size:14px;line-height:1.7;color:#9da3b4;">
        Speak soon,<br/>
        <strong style="color:#edede6;">The ${site.name} team</strong><br/>
        ${site.address.city}, ${site.address.country}
      </p>`),
  };
}
