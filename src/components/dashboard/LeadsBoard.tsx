"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Download,
  FileText,
  LoaderCircle,
  Search,
  X,
  CalendarCheck,
} from "lucide-react";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/lead-validation";
import { questions } from "@/config/landing";

/** Serialized Lead as returned by /api/leads. */
type LeadRow = {
  id: string;
  createdAt: string;
  updatedAt: string;
  fullName: string | null;
  businessName: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  selectedOffer: string | null;
  answers: Record<string, string>;
  painPoint: string | null;
  meetingBooked: boolean;
  meetingTime: string | null;
  meetingRef: string | null;
  status: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  fbclid: string | null;
  ip: string | null;
  userAgent: string | null;
};

const POLL_MS = 7000;

const STATUS_STYLES: Record<string, string> = {
  new: "bg-lime/15 text-lime",
  contacted: "bg-teal/15 text-teal",
  booked: "bg-amber-400/15 text-amber-300",
  won: "bg-lime text-coal",
  lost: "bg-red-400/15 text-red-300",
};

const questionLabel = (id: string) =>
  questions.find((q) => q.id === id)?.label ?? id.replace(/_/g, " ");

function relTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function csvEscape(v: unknown): string {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function leadsToCsv(rows: LeadRow[]): string {
  const cols = [
    "createdAt", "fullName", "businessName", "email", "phone", "city",
    "selectedOffer", "painPoint", "status", "meetingBooked", "meetingTime",
    "utmSource", "utmMedium", "utmCampaign", "utmContent", "utmTerm", "fbclid",
  ] as const;
  const header = [...cols, "answers"].join(",");
  const lines = rows.map((r) =>
    [...cols.map((c) => csvEscape(r[c])), csvEscape(JSON.stringify(r.answers))].join(","),
  );
  return [header, ...lines].join("\n");
}

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function downloadPdf(lead: LeadRow) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  const line = (label: string, value: string, y: number): number => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(label.toUpperCase(), 14, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(20);
    const wrapped = doc.splitTextToSize(value || "-", 130);
    doc.text(wrapped, 62, y);
    return y + wrapped.length * 5.5 + 3;
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Shan Digital Marketing — Lead", 14, 18);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120);
  doc.text(new Date(lead.createdAt).toLocaleString("en-GB"), 14, 25);

  let y = 36;
  y = line("Name", lead.fullName ?? "", y);
  y = line("Business", lead.businessName ?? "", y);
  y = line("Email", lead.email ?? "", y);
  y = line("Phone", lead.phone ?? "", y);
  y = line("Town", lead.city ?? "", y);
  y = line("Package", lead.selectedOffer ?? "", y);
  y = line("Status", lead.status, y);
  y = line(
    "Meeting",
    lead.meetingBooked
      ? `Booked${lead.meetingTime ? ` — ${new Date(lead.meetingTime).toLocaleString("en-GB")}` : ""}`
      : "Not booked",
    y,
  );

  y += 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(20);
  doc.text("Questionnaire", 14, y);
  y += 7;
  for (const [k, v] of Object.entries(lead.answers ?? {})) {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    y = line(questionLabel(k).slice(0, 40), String(v), y);
  }

  y += 4;
  if (y > 260) {
    doc.addPage();
    y = 20;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Attribution", 14, y);
  y += 7;
  y = line(
    "Source",
    [lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(" / ") || "direct",
    y,
  );
  if (lead.fbclid) line("fbclid", lead.fbclid.slice(0, 60), y);

  doc.save(`lead-${(lead.businessName ?? lead.id).replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.pdf`);
}

export default function LeadsBoard() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<LeadRow | null>(null);
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchLeads = useCallback(async () => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (q) params.set("q", q);
    params.set("page", String(page));
    try {
      const res = await fetch(`/api/leads?${params.toString()}`);
      if (!res.ok) return;
      const json = (await res.json()) as {
        total: number;
        pageSize: number;
        leads: LeadRow[];
      };
      setLeads(json.leads);
      setTotal(json.total);
      setPageSize(json.pageSize);
    } catch {
      /* transient poll failure — next tick retries */
    } finally {
      setLoading(false);
    }
  }, [status, q, page]);

  // Initial + near-realtime polling (only while the tab is visible).
  // The kickoff fetch is deferred a tick so the effect body never
  // touches state synchronously.
  useEffect(() => {
    const kickoff = setTimeout(fetchLeads, 0);
    const id = setInterval(() => {
      if (document.visibilityState === "visible") fetchLeads();
    }, POLL_MS);
    return () => {
      clearTimeout(kickoff);
      clearInterval(id);
    };
  }, [fetchLeads]);

  const updateStatus = useCallback(
    async (lead: LeadRow, next: LeadStatus) => {
      setLeads((ls) => ls.map((l) => (l.id === lead.id ? { ...l, status: next } : l)));
      setSelected((s) => (s?.id === lead.id ? { ...s, status: next } : s));
      try {
        await fetch(`/api/leads/${encodeURIComponent(lead.id)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: next }),
        });
      } catch {
        fetchLeads(); // revert to server truth
      }
    },
    [fetchLeads],
  );

  const todayCount = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return leads.filter((l) => new Date(l.createdAt) >= start).length;
  }, [leads]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      {/* Stats + toolbar */}
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-3">
          {[
            { label: "Total leads", value: total },
            { label: "New today (page)", value: todayCount },
            { label: "Booked", value: leads.filter((l) => l.meetingBooked).length },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-line bg-ink-2 px-4 py-2.5 text-center">
              <p className="font-display text-lg font-bold text-lime">{s.value}</p>
              <p className="font-label text-[9px] uppercase tracking-wider text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
            <input
              aria-label="Search leads"
              placeholder="Search name, business, email…"
              defaultValue={q}
              onChange={(e) => {
                if (searchDebounce.current) clearTimeout(searchDebounce.current);
                const value = e.target.value;
                searchDebounce.current = setTimeout(() => {
                  setLoading(true);
                  setPage(1);
                  setQ(value.trim());
                }, 350);
              }}
              className="w-56 rounded-full border border-line bg-ink-2 py-2.5 pl-10 pr-4 text-sm text-mist placeholder:text-muted/60 focus:border-lime focus:outline-none"
            />
          </div>
          <select
            aria-label="Filter by status"
            value={status}
            onChange={(e) => {
              setLoading(true);
              setPage(1);
              setStatus(e.target.value);
            }}
            className="cursor-pointer rounded-full border border-line bg-ink-2 px-4 py-2.5 text-sm text-mist focus:border-lime focus:outline-none"
          >
            <option value="">All statuses</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => download(`leads-${new Date().toISOString().slice(0, 10)}.csv`, leadsToCsv(leads), "text/csv")}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-2.5 font-label text-xs uppercase tracking-wider text-muted transition-colors hover:border-lime hover:text-lime"
          >
            <Download className="size-3.5" aria-hidden />
            Export CSV
          </button>
        </div>
      </div>

      {/* List */}
      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[46rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-ink-2 text-left font-label text-[10px] uppercase tracking-wider text-muted">
              <th className="px-4 py-3 font-medium">When</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Business</th>
              <th className="px-4 py-3 font-medium">Town</th>
              <th className="px-4 py-3 font-medium">Package</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Meeting</th>
            </tr>
          </thead>
          <tbody>
            {loading && leads.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-14 text-center text-muted">
                  <LoaderCircle className="mx-auto size-5 animate-spin" aria-hidden />
                </td>
              </tr>
            )}
            {!loading && leads.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-14 text-center text-muted">
                  No leads yet. New enquiries from /landing appear here automatically.
                </td>
              </tr>
            )}
            {leads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => setSelected(lead)}
                className="cursor-pointer border-b border-line/60 transition-colors last:border-0 hover:bg-ink-2/60"
              >
                <td className="whitespace-nowrap px-4 py-3 text-muted">{relTime(lead.createdAt)}</td>
                <td className="whitespace-nowrap px-4 py-3 font-medium text-mist">{lead.fullName ?? "—"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-muted">{lead.businessName ?? "—"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-muted">{lead.city ?? "—"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-muted">{lead.selectedOffer ?? "—"}</td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <select
                    aria-label={`Status for ${lead.fullName ?? "lead"}`}
                    value={lead.status}
                    onChange={(e) => updateStatus(lead, e.target.value as LeadStatus)}
                    className={`cursor-pointer rounded-full border-0 px-3 py-1.5 font-label text-[10px] font-bold uppercase tracking-wider focus:outline-none ${STATUS_STYLES[lead.status] ?? "bg-ink-3 text-muted"}`}
                  >
                    {LEAD_STATUSES.map((s) => (
                      <option key={s} value={s} className="bg-ink-2 text-mist">
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  {lead.meetingBooked ? (
                    <CalendarCheck className="size-4 text-lime" aria-label="Meeting booked" />
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between text-sm text-muted">
        <span>
          Page {page} of {totalPages} · updates live
        </span>
        <div className="flex gap-2">
          {page > 1 && (
            <button type="button" onClick={() => setPage(page - 1)} className="cursor-pointer rounded-full border border-line px-4 py-2 transition-colors hover:border-lime hover:text-lime">
              Previous
            </button>
          )}
          {page < totalPages && (
            <button type="button" onClick={() => setPage(page + 1)} className="cursor-pointer rounded-full border border-line px-4 py-2 transition-colors hover:border-lime hover:text-lime">
              Next
            </button>
          )}
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/70 p-4 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label={`Lead: ${selected.fullName ?? "detail"}`}
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-line bg-ink-2 p-6 sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-extrabold tracking-tight text-mist">
                  {selected.fullName ?? "Lead"}
                </h2>
                <p className="mt-0.5 text-sm text-muted">
                  {selected.businessName}
                  {selected.city ? ` · ${selected.city}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line text-muted hover:border-lime hover:text-lime"
                aria-label="Close"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <dl className="mt-5 space-y-2.5 text-sm">
              {(
                [
                  ["Email", selected.email],
                  ["Phone", selected.phone],
                  ["Package", selected.selectedOffer],
                  ["Pain point", selected.painPoint],
                  ["Status", selected.status],
                  [
                    "Meeting",
                    selected.meetingBooked
                      ? `Booked${selected.meetingTime ? ` — ${new Date(selected.meetingTime).toLocaleString("en-GB")}` : ""}${selected.meetingRef ? ` (${selected.meetingRef})` : ""}`
                      : "Not booked",
                  ],
                  ["Created", new Date(selected.createdAt).toLocaleString("en-GB")],
                ] as const
              ).map(([label, value]) => (
                <div key={label} className="flex gap-3">
                  <dt className="w-24 shrink-0 font-label text-[10px] uppercase tracking-wider text-muted">
                    {label}
                  </dt>
                  <dd className="text-mist">{value || "—"}</dd>
                </div>
              ))}
            </dl>

            <h3 className="font-display mt-6 text-sm font-bold uppercase tracking-wider text-lime">
              Questionnaire
            </h3>
            <dl className="mt-3 space-y-3 rounded-2xl border border-line bg-ink p-4 text-sm">
              {Object.entries(selected.answers ?? {}).length === 0 && (
                <p className="text-muted">No answers recorded.</p>
              )}
              {Object.entries(selected.answers ?? {}).map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-muted">{questionLabel(k)}</dt>
                  <dd className="mt-0.5 font-medium text-mist">{String(v)}</dd>
                </div>
              ))}
            </dl>

            <h3 className="font-display mt-6 text-sm font-bold uppercase tracking-wider text-lime">
              Attribution
            </h3>
            <p className="mt-2 text-sm text-muted">
              {[selected.utmSource, selected.utmMedium, selected.utmCampaign]
                .filter(Boolean)
                .join(" / ") || "Direct / unknown"}
              {selected.utmContent ? ` · ${selected.utmContent}` : ""}
              {selected.fbclid ? " · fbclid captured" : ""}
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => download(`lead-${selected.id}.csv`, leadsToCsv([selected]), "text/csv")}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-2.5 font-label text-xs uppercase tracking-wider text-muted transition-colors hover:border-lime hover:text-lime"
              >
                <Download className="size-3.5" aria-hidden />
                CSV
              </button>
              <button
                type="button"
                onClick={() => downloadPdf(selected)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-lime px-4 py-2.5 font-label text-xs font-bold uppercase tracking-wider text-coal transition-colors hover:bg-lime-deep"
              >
                <FileText className="size-3.5" aria-hidden />
                PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
