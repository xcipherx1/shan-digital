import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { leadStatusPatchSchema } from "@/lib/lead-validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") return null;
  return session;
}

/** ADMIN — full lead detail (all questionnaire answers + attribution). */
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ lead });
}

/** ADMIN — update pipeline status. */
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const parsed = leadStatusPatchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 422 });
  }

  const updated = await prisma.lead
    .update({
      where: { id },
      data: { status: parsed.data.status },
      select: { id: true, status: true },
    })
    .catch(() => null);
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}
