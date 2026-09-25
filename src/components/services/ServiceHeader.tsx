import Link from "next/link";
import { Mail, PhoneCall } from "lucide-react";
import { site } from "@/config/site";

/**
 * Compact header for the service pages. Keeps the contact bar from the
 * main site (tap to call is the fastest conversion on these pages) but
 * drops the section nav, which only exists on the homepage.
 */
export default function ServiceHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur-xl">
      <div className="border-b border-line/70 bg-ink-2/80">
        <div className="mx-auto flex h-9 max-w-6xl items-center justify-between gap-3 px-4 sm:px-8">
          <a
            href={`tel:${site.phoneHref}`}
            className="inline-flex shrink-0 items-center gap-1.5 font-label text-[11px] tracking-wide text-muted transition-colors hover:text-lime sm:text-xs"
          >
            <PhoneCall className="size-3 text-lime sm:size-3.5" aria-hidden />
            {site.phone}
          </a>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex min-w-0 items-center gap-1.5 font-label text-[11px] tracking-wide text-muted transition-colors hover:text-lime sm:text-xs"
          >
            <Mail className="size-3 shrink-0 text-lime sm:size-3.5" aria-hidden />
            <span className="truncate">{site.email}</span>
          </a>
        </div>
      </div>

      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-8">
        <Link href="/" className="font-display text-lg font-extrabold tracking-tight text-mist">
          {site.shortName}
          <span className="text-lime">.</span>
          <span className="ml-2 hidden font-label text-[10px] font-medium uppercase tracking-[0.2em] text-muted sm:inline">
            Digital Marketing
          </span>
        </Link>
        <div className="flex items-center gap-5">
          <Link
            href="/services"
            className="hidden font-label text-xs uppercase tracking-wider text-muted transition-colors hover:text-lime sm:inline"
          >
            All services
          </Link>
          <Link
            href="/#lead"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-lime px-5 py-2.5 font-display text-sm font-bold text-coal transition-colors hover:bg-lime-deep"
          >
            Free audit
          </Link>
        </div>
      </div>
    </header>
  );
}
