import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buildCallWhere, normaliseFilters } from "@/lib/call-query";
import HistoryFilters from "@/components/dialer/HistoryFilters";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

function fmtDuration(seconds: number | null): string {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function statusClass(status: string): string {
  if (status === "completed") return "text-lime";
  if (["busy", "no-answer", "canceled"].includes(status)) return "text-amber-300";
  if (status === "failed") return "text-red-300";
  return "text-muted";
}

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/dialer/login");

  const sp = await searchParams;
  const get = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const filters = normaliseFilters(get);
  const isAdmin = session.user.role === "admin";
  const where = buildCallWhere(session.user.id, isAdmin, filters);

  const page = Math.max(1, parseInt(get("page") ?? "1", 10) || 1);

  const [total, calls] = await Promise.all([
    prisma.call.count({ where }),
    prisma.call.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { user: { select: { name: true } } },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Preserve filters across pagination links.
  const baseParams = new URLSearchParams(
    Object.entries(filters).filter(([, v]) => v) as [string, string][],
  );
  const pageHref = (p: number) => {
    const params = new URLSearchParams(baseParams);
    params.set("page", String(p));
    return `/dialer/history?${params.toString()}`;
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="mb-8">
        <p className="font-label text-[11px] uppercase tracking-[0.25em] text-lime">
          Call history
        </p>
        <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {isAdmin ? "All calls" : "Your calls"}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {total} call{total === 1 ? "" : "s"} recorded.
        </p>
      </div>

      <HistoryFilters initial={filters} />

      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[54rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-ink-2 text-left font-label text-[10px] uppercase tracking-wider text-muted">
              <th className="px-4 py-3 font-medium">Date</th>
              {isAdmin && <th className="px-4 py-3 font-medium">Agent</th>}
              <th className="px-4 py-3 font-medium">Number</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Duration</th>
              <th className="px-4 py-3 font-medium">Cost</th>
              <th className="px-4 py-3 font-medium">Disposition</th>
              <th className="px-4 py-3 font-medium">Recording</th>
              <th className="px-4 py-3 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {calls.length === 0 && (
              <tr>
                <td
                  colSpan={isAdmin ? 9 : 8}
                  className="px-4 py-12 text-center text-muted"
                >
                  No calls match these filters.
                </td>
              </tr>
            )}
            {calls.map((c) => (
              <tr
                key={c.id}
                className="border-b border-line/60 last:border-0 hover:bg-ink-2/50"
              >
                <td className="whitespace-nowrap px-4 py-3 text-muted">
                  {c.createdAt.toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                {isAdmin && (
                  <td className="whitespace-nowrap px-4 py-3 text-muted">
                    {c.user?.name ?? "—"}
                  </td>
                )}
                <td className="whitespace-nowrap px-4 py-3 font-medium text-mist">
                  {c.toNumber}
                </td>
                <td className={`whitespace-nowrap px-4 py-3 ${statusClass(c.status)}`}>
                  {c.status}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted">
                  {fmtDuration(c.durationSeconds)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted">
                  {c.priceUsd ? `$${Number(c.priceUsd).toFixed(4)}` : "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted">
                  {c.disposition ?? "—"}
                </td>
                <td className="px-4 py-3">
                  {c.recordingSid ? (
                    <audio
                      controls
                      preload="none"
                      className="h-8 w-44"
                      src={`/api/dialer/recordings/${c.recordingSid}`}
                    />
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="max-w-[16rem] px-4 py-3 text-muted">
                  <span className="line-clamp-2">{c.notes || "—"}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between text-sm text-muted">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          {page > 1 && (
            <Link
              href={pageHref(page - 1)}
              className="rounded-full border border-line px-4 py-2 transition-colors hover:border-lime hover:text-lime"
            >
              Previous
            </Link>
          )}
          {page < totalPages && (
            <Link
              href={pageHref(page + 1)}
              className="rounded-full border border-line px-4 py-2 transition-colors hover:border-lime hover:text-lime"
            >
              Next
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
