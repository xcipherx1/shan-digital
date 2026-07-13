import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DISPOSITIONS } from "@/lib/dispositions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const patchSchema = z.object({
  disposition: z.enum(DISPOSITIONS).nullish(),
  notes: z.string().max(2000).nullish(),
});

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid disposition or notes." },
      { status: 422 },
    );
  }

  // Accept either the DB id or the Twilio CallSid (the client only
  // knows the CallSid at the end of a call).
  const call = await prisma.call.findFirst({
    where: { OR: [{ id }, { callSid: id }] },
  });
  if (!call) {
    return NextResponse.json({ error: "Call not found" }, { status: 404 });
  }

  // Ownership: a user may only edit their own calls unless they are admin.
  if (call.userId !== session.user.id && session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.call.update({
    where: { id: call.id },
    data: {
      ...(parsed.data.disposition !== undefined
        ? { disposition: parsed.data.disposition }
        : {}),
      ...(parsed.data.notes !== undefined ? { notes: parsed.data.notes } : {}),
    },
    select: { id: true, disposition: true, notes: true },
  });

  return NextResponse.json(updated);
}
