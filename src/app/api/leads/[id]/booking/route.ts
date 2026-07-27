import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookingPatchSchema } from "@/lib/lead-validation";
import { isThrottled } from "@/lib/lead-throttle";
import { getClientIp } from "@/lib/rate-limit";
import { sendBookingEmails } from "@/lib/lead-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * PUBLIC — Stage 2 of the funnel. Marks the meeting booked on an
 * existing lead. Deliberately narrow: it can only set booking fields,
 * only on a lead that isn't already closed, and the id (cuid) is
 * unguessable — the caller must have just created the lead.
 */
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const ip = getClientIp(req);
  if (isThrottled(ip, "lead-booking")) {
    return NextResponse.json(
      { message: "Too many requests. Please try again shortly." },
      { status: 429 },
    );
  }

  const { id } = await context.params;

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }
  const parsed = bookingPatchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid booking." }, { status: 422 });
  }

  let updated;
  try {
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead || lead.status === "won" || lead.status === "lost") {
      return NextResponse.json({ message: "Not found." }, { status: 404 });
    }

    updated = await prisma.lead.update({
      where: { id },
      data: {
        meetingBooked: true,
        meetingTime: parsed.data.meetingTime
          ? new Date(parsed.data.meetingTime)
          : lead.meetingTime,
        meetingRef: parsed.data.meetingRef ?? lead.meetingRef,
        status:
          lead.status === "new" || lead.status === "contacted"
            ? "booked"
            : lead.status,
      },
    });
  } catch (err) {
    console.error("[leads] Failed to record booking:", err);
    return NextResponse.json(
      { message: "We couldn't record the booking just now." },
      { status: 503 },
    );
  }

  // Best-effort confirmation + agency update.
  await sendBookingEmails(updated);

  return NextResponse.json({ ok: true });
}
