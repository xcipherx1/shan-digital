"use client";

import { useRouter } from "next/navigation";
import { Download, Search, X } from "lucide-react";
import { DISPOSITIONS } from "@/lib/dispositions";

const STATUSES = [
  "completed",
  "no-answer",
  "busy",
  "failed",
  "canceled",
  "initiated",
  "in-progress",
];

export type FilterValues = {
  from?: string;
  to?: string;
  status?: string;
  disposition?: string;
  q?: string;
};

export default function HistoryFilters({
  initial,
}: {
  initial: FilterValues;
}) {
  const router = useRouter();

  function apply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    for (const key of ["from", "to", "status", "disposition", "q"]) {
      const v = String(form.get(key) ?? "").trim();
      if (v) params.set(key, v);
    }
    router.push(`/dialer/history?${params.toString()}`);
  }

  const exportParams = new URLSearchParams(
    Object.entries(initial).filter(([, v]) => v) as [string, string][],
  ).toString();

  const inputCls =
    "rounded-xl border border-line bg-ink px-3 py-2 text-sm text-mist placeholder:text-muted/60 focus:border-lime focus:outline-none";

  return (
    <form
      onSubmit={apply}
      className="mb-6 flex flex-wrap items-end gap-3 rounded-2xl border border-line bg-ink-2 p-4"
    >
      <label className="flex flex-col gap-1">
        <span className="font-label text-[10px] uppercase tracking-wider text-muted">From</span>
        <input type="date" name="from" defaultValue={initial.from} className={inputCls} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-label text-[10px] uppercase tracking-wider text-muted">To</span>
        <input type="date" name="to" defaultValue={initial.to} className={inputCls} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-label text-[10px] uppercase tracking-wider text-muted">Status</span>
        <select name="status" defaultValue={initial.status ?? ""} className={inputCls}>
          <option value="">Any</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-label text-[10px] uppercase tracking-wider text-muted">Disposition</span>
        <select name="disposition" defaultValue={initial.disposition ?? ""} className={inputCls}>
          <option value="">Any</option>
          {DISPOSITIONS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-1 flex-col gap-1">
        <span className="font-label text-[10px] uppercase tracking-wider text-muted">Number</span>
        <input
          type="text"
          name="q"
          defaultValue={initial.q}
          placeholder="Search number…"
          className={`${inputCls} min-w-[8rem]`}
        />
      </label>

      <button
        type="submit"
        className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-lime px-4 py-2 font-display text-sm font-bold text-coal transition-colors hover:bg-lime-deep"
      >
        <Search className="size-4" aria-hidden />
        Filter
      </button>
      <button
        type="button"
        onClick={() => router.push("/dialer/history")}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-sm text-muted transition-colors hover:text-mist"
      >
        <X className="size-4" aria-hidden />
        Reset
      </button>
      <a
        href={`/api/dialer/calls/export${exportParams ? `?${exportParams}` : ""}`}
        className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-lime hover:text-lime"
      >
        <Download className="size-4" aria-hidden />
        CSV
      </a>
    </form>
  );
}
