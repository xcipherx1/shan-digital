import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { leadSubmitSchema } from "@/lib/lead-validation";
import { isThrottled } from "@/lib/lead-throttle";
import { getClientIp } from "@/lib/rate-limit";
import { sendNewLeadNotification } from "@/lib/lead-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

/**
 * PUBLIC — Stage 1 of the funnel. Creates the lead the moment contact
 * details are submitted so later drop-offs are never lost.
 */
export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (isThrottled(ip, "lead-create")) {
    return NextResponse.json(
      { message: "Too many requests. Please try again shortly." },
      { status: 429 },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const parsed = leadSubmitSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please check your details and try again." },
      { status: 422 },
    );
  }
  const data = parsed.data;

  // Honeypot tripped: pretend success so bots learn nothing.
  if (data.website) {
    return NextResponse.json({ id: "ok" }, { status: 201 });
  }

  let lead;
  try {
    lead = await prisma.lead.create({
      data: {
      fullName: data.fullName,
      businessName: data.businessName,
      email: data.email.toLowerCase(),
      phone: data.phone,
      city: data.city || null,
      selectedOffer: data.selectedOffer ?? null,
      painPoint: data.painPoint ?? null,
      answers: data.answers as Prisma.InputJsonValue,
      utmSource: data.utmSource ?? null,
      utmMedium: data.utmMedium ?? null,
      utmCampaign: data.utmCampaign ?? null,
      utmContent: data.utmContent ?? null,
      utmTerm: data.utmTerm ?? null,
      fbclid: data.fbclid ?? null,
        ip,
        userAgent: req.headers.get("user-agent")?.slice(0, 500) ?? null,
      },
    });
  } catch (err) {
    // Detailed cause stays server-side; the visitor gets a way forward.
    console.error("[leads] Failed to save lead:", err);
    return NextResponse.json(
      { message: "We couldn't save your details just now. Please email us instead." },
      { status: 503 },
    );
  }

  // Best-effort — never fails the request.
  await sendNewLeadNotification(lead);

  return NextResponse.json({ id: lead.id }, { status: 201 });
}

/** ADMIN — paginated list with status filter + search. */
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const status = url.searchParams.get("status") ?? undefined;
  const q = url.searchParams.get("q")?.trim() ?? "";
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10) || 1);

  const where: Prisma.LeadWhereInput = {
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { fullName: { contains: q, mode: "insensitive" } },
            { businessName: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [total, leads] = await Promise.all([
    prisma.lead.count({ where }),
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  return NextResponse.json({ total, page, pageSize: PAGE_SIZE, leads });
}
