import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buildCallWhere, normaliseFilters } from "@/lib/call-query";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_ROWS = 5000;

function csvCell(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  // Escape quotes; wrap if the cell contains a delimiter, quote or newline.
  if (/["\n\r,]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const isAdmin = session.user.role === "admin";
  const sp = new URL(req.url).searchParams;
  const filters = normaliseFilters((k) => sp.get(k) ?? undefined);
  const where = buildCallWhere(session.user.id, isAdmin, filters);

  const calls = await prisma.call.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: MAX_ROWS,
  });

  const header = [
    "Date",
    "From",
    "To",
    "Status",
    "Duration (s)",
    "Cost (USD)",
    "Disposition",
    "Notes",
    "Call SID",
  ];

  const rows = calls.map((c) =>
    [
      c.createdAt.toISOString(),
      c.fromNumber,
      c.toNumber,
      c.status,
      c.durationSeconds ?? "",
      c.priceUsd ? c.priceUsd.toString() : "",
      c.disposition ?? "",
      c.notes ?? "",
      c.callSid,
    ]
      .map(csvCell)
      .join(","),
  );

  const csv = [header.map(csvCell).join(","), ...rows].join("\r\n");
  const filename = `call-history-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
