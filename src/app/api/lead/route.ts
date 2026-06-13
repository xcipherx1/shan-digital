import { NextResponse } from "next/server";
import { Resend } from "resend";
import { leadSchema } from "@/lib/validation";
import { leadConfirmationEmail, leadNotificationEmail } from "@/lib/email";
import { site } from "@/config/site";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = leadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please check the form fields and try again." },
      { status: 422 },
    );
  }
  const lead = parsed.data;

  // Honeypot tripped — pretend success so bots learn nothing.
  if (lead.company) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  // Falls back to Resend's shared sender, which needs no domain
  // verification — so the form works as soon as an API key is set.
  const from =
    process.env.RESEND_FROM_EMAIL ??
    "Shan Digital Marketing <onboarding@resend.dev>";
  const to = process.env.LEAD_NOTIFICATION_EMAIL ?? site.email;

  if (!apiKey) {
    console.error("[lead] RESEND_API_KEY is not configured.");
    return NextResponse.json(
      {
        message: `Our email service isn't configured yet. Please email us directly at ${site.email}.`,
      },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);
  const notification = leadNotificationEmail(lead);
  const confirmation = leadConfirmationEmail(lead);

  // The agency notification is the critical email; the visitor
  // confirmation is best-effort and must not fail the request.
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: lead.email,
    subject: notification.subject,
    html: notification.html,
  });

  if (error) {
    console.error("[lead] Failed to send notification:", error);
    return NextResponse.json(
      {
        message: `We couldn't process your request right now. Please email us directly at ${site.email}.`,
        // Surface the real Resend error during development only.
        ...(process.env.NODE_ENV !== "production"
          ? { detail: error.message }
          : {}),
      },
      { status: 502 },
    );
  }

  try {
    await resend.emails.send({
      from,
      to: lead.email,
      subject: confirmation.subject,
      html: confirmation.html,
    });
  } catch (err) {
    console.error("[lead] Confirmation email failed (non-fatal):", err);
  }

  return NextResponse.json({ ok: true });
}
