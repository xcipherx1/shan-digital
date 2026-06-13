import {
  ArrowUp,
  ArrowUpRight,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";
import { nav, services, site } from "@/config/site";
import LocalTime from "@/components/ui/LocalTime";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="grain relative overflow-hidden border-t border-line bg-ink px-5 pt-20 sm:px-8 md:pt-28">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(201,247,58,0.06), transparent 60%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl">
        {/* CTA banner */}
        <div className="flex flex-col gap-10 border-b border-line pb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 font-label text-xs font-medium uppercase tracking-[0.25em] text-lime">
              <span className="animate-pulse-dot size-1.5 rounded-full bg-lime" aria-hidden />
              Taking on 3 new clients this quarter
            </p>
            <h2 className="font-display max-w-3xl text-[clamp(2.4rem,7vw,5.5rem)] font-extrabold leading-[0.98] tracking-tight text-mist">
              Let&apos;s put you{" "}
              <em className="font-serif italic font-normal text-lime">
                on the map.
              </em>
            </h2>
          </div>
          <a
            href="#lead"
            className="inline-flex w-fit shrink-0 cursor-pointer items-center gap-2 rounded-full bg-lime px-8 py-4 font-display text-base font-bold text-coal transition-colors duration-200 hover:bg-lime-deep"
          >
            Start with a free audit
            <ArrowUpRight className="size-5" aria-hidden />
          </a>
        </div>

        {/* Columns */}
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <p className="font-display text-xl font-extrabold text-mist">
              {site.shortName}
              <span className="text-lime">.</span>
              <span className="ml-2 font-label text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
                Digital Marketing
              </span>
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Complete growth systems for SMEs and industries, built in
              Bristol, ranking everywhere that matters.
            </p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-label text-xs text-muted">
              <Clock className="size-3.5 text-lime" aria-hidden />
              Bristol · <LocalTime />
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <p className="mb-5 font-label text-xs font-medium uppercase tracking-[0.25em] text-muted">
              Explore
            </p>
            <ul className="space-y-3.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-mist transition-colors duration-200 hover:text-lime"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Services">
            <p className="mb-5 font-label text-xs font-medium uppercase tracking-[0.25em] text-muted">
              Services
            </p>
            <ul className="space-y-3.5">
              {services.map((s) => (
                <li key={s.key}>
                  <a
                    href="#service-details"
                    className="text-sm text-mist transition-colors duration-200 hover:text-lime"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <address className="not-italic">
            <p className="mb-5 font-label text-xs font-medium uppercase tracking-[0.25em] text-muted">
              Contact
            </p>
            <ul className="space-y-4 text-sm text-mist">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-2.5 transition-colors duration-200 hover:text-lime"
                >
                  <Mail className="size-4 shrink-0 text-lime" aria-hidden />
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={site.address.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-2.5 text-muted transition-colors duration-200 hover:text-lime"
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-lime" aria-hidden />
                  <span>
                    {site.address.street}, {site.address.postcode},<br />
                    {site.address.city}, {site.address.country}
                  </span>
                </a>
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              {Object.entries(site.social).map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-line px-4 py-2 font-label text-xs capitalize text-muted transition-colors duration-200 hover:border-lime hover:text-lime"
                >
                  {key}
                </a>
              ))}
            </div>
          </address>
        </div>

        {/* Bottom bar */}
        <div className="relative flex flex-col items-start justify-between gap-4 border-t border-line py-8 text-xs text-muted sm:flex-row sm:items-center">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p>Designed & engineered in {site.address.city}, UK</p>
          <a
            href="#top"
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-2 font-label uppercase tracking-wider text-muted transition-colors duration-200 hover:border-lime hover:text-lime"
            aria-label="Back to top"
          >
            Back to top
            <ArrowUp className="size-3.5" aria-hidden />
          </a>
        </div>
      </div>

      {/* Giant watermark */}
      <div className="relative -mb-6 select-none overflow-hidden" aria-hidden>
        <p className="text-outline font-display whitespace-nowrap text-center text-[clamp(6rem,22vw,22rem)] font-extrabold leading-[0.78] tracking-tight">
          SHAN<span className="text-outline-lime">®</span>
        </p>
      </div>
    </footer>
  );
}
