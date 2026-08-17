"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, LayoutGrid, PhoneCall, Users } from "lucide-react";

/**
 * Switches between the two separate workspaces that share one login:
 * the Leads dashboard (/dashboard) and the Agent dialer (/dialer).
 * Leads is admin-only, so agents only ever see the dialer entry.
 */
export default function AppSwitcher({
  current,
  isAdmin,
}: {
  current: "leads" | "dialer";
  isAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Agents have exactly one workspace — render a plain label, no menu.
  if (!isAdmin) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-2 font-label text-[11px] uppercase tracking-wider text-lime">
        <PhoneCall className="size-3.5" aria-hidden />
        Dialer
      </span>
    );
  }

  const apps = [
    { key: "leads", label: "Leads", href: "/dashboard", Icon: Users },
    { key: "dialer", label: "Dialer", href: "/dialer", Icon: PhoneCall },
  ] as const;
  const active = apps.find((a) => a.key === current)!;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-3.5 py-2 font-label text-[11px] uppercase tracking-wider text-lime transition-colors hover:border-lime"
      >
        <active.Icon className="size-3.5" aria-hidden />
        {active.label}
        <ChevronDown
          className={`size-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-line bg-ink-2 p-1.5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]"
        >
          <p className="px-3 py-2 font-label text-[9px] uppercase tracking-[0.2em] text-muted">
            <LayoutGrid className="mr-1.5 inline size-3" aria-hidden />
            Workspaces
          </p>
          {apps.map((a) => (
            <Link
              key={a.key}
              href={a.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                a.key === current
                  ? "bg-lime/10 text-lime"
                  : "text-mist hover:bg-ink-3"
              }`}
            >
              <a.Icon className="size-4" aria-hidden />
              {a.label}
              {a.key === current && (
                <span className="ml-auto font-label text-[9px] uppercase tracking-wider text-muted">
                  Current
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
