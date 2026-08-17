import type { Metadata } from "next";
import {
  ArrowRight,
  Check,
  Hammer,
  Mail,
  MapPin,
  PhoneCall,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { site } from "@/config/site";
import {
  clients,
  faqs,
  funnel,
  guarantee,
  hero,
  offers,
  privacyNote,
  problem,
  stats,
  steps,
  testimonials,
} from "@/config/landing";
import Questionnaire from "@/components/landing/Questionnaire";
import StickyCTA from "@/components/landing/StickyCTA";
import MetaPixel from "@/components/landing/MetaPixel";

export const metadata: Metadata = {
  title: "Lead-Generating Websites for UK Roofing Companies",
  description:
    "We build fast, local-SEO websites that put UK roofing companies at the top of Google in their town and turn visitors into booked jobs. Live in days. From £600.",
  alternates: { canonical: `${site.url}/landing` },
  openGraph: {
    title: "Lead-Generating Websites for UK Roofing Companies",
    description:
      "Rank in your town. Turn visitors into booked jobs. Websites for roofers from £600, live in days.",
    url: `${site.url}/landing`,
    type: "website",
  },
  robots: { index: true, follow: true },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Roofing Company Website Design & Local SEO",
  provider: {
    "@type": "Organization",
    name: site.name,
    email: site.email,
    url: site.url,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.address.city,
      addressCountry: "GB",
    },
  },
  areaServed: "United Kingdom",
  audience: { "@type": "Audience", audienceType: "Roofing companies" },
  offers: offers.map((o) => ({
    "@type": "Offer",
    name: o.name,
    price: o.price.replace(/[^0-9.]/g, ""),
    priceCurrency: "GBP",
  })),
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

function CtaButton({ label = hero.cta }: { label?: string }) {
  return (
    <a
      href="#plan"
      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-lime px-7 py-4 font-display text-base font-bold text-coal transition-colors duration-200 hover:bg-lime-deep"
    >
      {label}
      <ArrowRight className="size-5" aria-hidden />
    </a>
  );
}

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ h?: string }>;
}) {
  const { h } = await searchParams;
  const headline =
    h === "b" ? hero.headlines.b : h === "c" ? hero.headlines.c : hero.headlines.a;

  return (
    <div className="bg-ink text-mist">
      <MetaPixel />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Minimal funnel header — no site nav to leak attention */}
      <header className="sticky top-0 z-30 border-b border-line bg-ink/90 backdrop-blur-xl">
        {/* Contact bar: tapping the phone is often the fastest conversion */}
        <div className="border-b border-line/70 bg-ink-2/80">
          <div className="mx-auto flex h-9 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
            <a
              href={`tel:${site.phoneHref}`}
              className="inline-flex shrink-0 items-center gap-1.5 font-label text-[11px] tracking-wide text-muted transition-colors hover:text-lime sm:text-xs"
            >
              <PhoneCall className="size-3 text-lime sm:size-3.5" aria-hidden />
              {site.phone}
            </a>
            <a
              href={`mailto:${funnel.email}`}
              className="inline-flex min-w-0 items-center gap-1.5 font-label text-[11px] tracking-wide text-muted transition-colors hover:text-lime sm:text-xs"
            >
              <Mail className="size-3 shrink-0 text-lime sm:size-3.5" aria-hidden />
              <span className="truncate">{funnel.email}</span>
            </a>
          </div>
        </div>

        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:h-16 sm:px-6">
          <p className="font-display text-lg font-extrabold tracking-tight">
            Shan<span className="text-lime">.</span>
            <span className="ml-2 hidden font-label text-[10px] font-medium uppercase tracking-[0.2em] text-muted sm:inline">
              Digital Marketing
            </span>
          </p>
          <a
            href="#plan"
            className="hidden cursor-pointer items-center gap-1.5 rounded-full bg-lime px-5 py-2.5 font-display text-sm font-bold text-coal transition-colors hover:bg-lime-deep md:inline-flex"
          >
            Book my free call
          </a>
        </div>
      </header>

      <main>
        {/* ── 1. HERO ── */}
        <section className="grain relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 75% 55% at 50% 115%, rgba(201,247,58,0.12), transparent 60%)",
            }}
            aria-hidden
          />
          <div className="relative mx-auto max-w-5xl px-4 pb-12 pt-10 text-center sm:px-6 sm:pb-16 sm:pt-16">
            <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-line bg-ink-2/70 px-4 py-2 font-label text-[11px] font-medium uppercase tracking-[0.22em] text-lime">
              <Hammer className="size-3.5" aria-hidden />
              {hero.eyebrow}
            </p>
            <h1 className="font-display mx-auto mt-5 max-w-3xl text-[clamp(1.9rem,6.5vw,3.6rem)] font-extrabold leading-[1.05] tracking-tight">
              {headline}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {hero.subhead}
            </p>
            <div className="mt-7">
              <CtaButton />
            </div>
            <ul className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {hero.trustStrip.map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5 text-xs text-muted sm:text-sm">
                  <Check className="size-3.5 text-lime" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── 2. QUESTIONNAIRE ── */}
        <section id="plan" className="scroll-mt-28 px-4 pb-14 sm:px-6">
          <div className="mx-auto max-w-xl">
            <h2 className="font-display mb-4 text-center text-xl font-extrabold tracking-tight sm:text-2xl">
              Answer 8 quick questions, get your free website plan.
            </h2>
            <Questionnaire />
          </div>
        </section>

        {/* ── 3. PROBLEM ── */}
        <section className="on-light bg-cream px-4 py-14 text-coal sm:px-6 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              {problem.heading}
            </h2>
            <ul className="mt-7 space-y-4">
              {problem.lines.map((line) => (
                <li key={line} className="flex items-start gap-3 text-base leading-relaxed text-coal/80 sm:text-lg">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-coal" aria-hidden />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── 4. SOLUTION / HOW IT WORKS ── */}
        <section className="px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-display text-center text-2xl font-extrabold tracking-tight sm:text-4xl">
              From invisible to{" "}
              <em className="font-serif italic font-normal text-lime">fully booked,</em>{" "}
              in 3 steps.
            </h2>
            <ol className="mt-10 grid gap-4 sm:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s.title} className="rounded-3xl border border-line bg-ink-2 p-6">
                  <span className="font-display text-sm font-bold text-lime">
                    0{i + 1}
                  </span>
                  <h3 className="font-display mt-3 text-lg font-bold tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── 5. OFFERS / PRICING ── */}
        <section className="px-4 pb-14 sm:px-6 sm:pb-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-display text-center text-2xl font-extrabold tracking-tight sm:text-4xl">
              Straight prices. No surprises.
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {offers.map((o) => (
                <div
                  key={o.key}
                  className={`relative flex flex-col rounded-3xl border p-6 sm:p-7 ${
                    o.highlight
                      ? "border-lime bg-ink-2 shadow-[0_0_60px_-20px_rgba(201,247,58,0.35)]"
                      : "border-line bg-ink-2"
                  }`}
                >
                  {o.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-lime px-3.5 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-coal">
                      Most popular
                    </span>
                  )}
                  <h3 className="font-display text-lg font-bold tracking-tight">{o.name}</h3>
                  <p className="font-display mt-2 text-4xl font-extrabold tracking-tight text-lime">
                    {o.price}
                  </p>
                  <p className="mt-2 text-xs italic text-muted">{o.tagline}</p>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {o.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-mist">
                        <Check className="mt-0.5 size-4 shrink-0 text-lime" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#plan"
                    className={`mt-6 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-5 py-3 font-display text-sm font-bold transition-colors ${
                      o.highlight
                        ? "bg-lime text-coal hover:bg-lime-deep"
                        : "border border-line text-mist hover:border-lime hover:text-lime"
                    }`}
                  >
                    Book to get started
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. TRUST STACK ── */}
        <section className="on-light bg-cream px-4 py-14 text-coal sm:px-6 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-display text-center text-2xl font-extrabold tracking-tight sm:text-4xl">
              Businesses we&apos;ve built for across the UK.
            </h2>
            <p className="mt-3 text-center text-sm text-coal/60">
              Websites built for roofers and trades in Bristol, London,
              Leicester, Birmingham, Liverpool and beyond.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-2.5">
              {clients.roofing.map((name) => (
                <span
                  key={name}
                  className="rounded-full border border-coal/15 bg-cream-2 px-4 py-2.5 font-display text-sm font-bold"
                >
                  {name}
                </span>
              ))}
            </div>
            <p className="mt-6 text-center font-label text-[10px] uppercase tracking-[0.2em] text-coal/50">
              …and businesses in other sectors
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {clients.other.map((name) => (
                <span
                  key={name}
                  className="rounded-full border border-coal/10 px-3.5 py-1.5 text-xs text-coal/70"
                >
                  {name}
                </span>
              ))}
            </div>

            {/* Stats strip renders ONLY when real figures are configured */}
            {stats.length > 0 && (
              <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-2xl border border-coal/12 bg-cream-2 p-4 text-center">
                    <dd className="font-display text-2xl font-extrabold">{s.value}</dd>
                    <dt className="mt-1 text-xs text-coal/60">{s.label}</dt>
                  </div>
                ))}
              </dl>
            )}

            {/* Testimonials — real quotes only; labelled placeholders until supplied */}
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {testimonials.map((t) => (
                <figure
                  key={t.company}
                  className="relative rounded-3xl border border-coal/12 bg-cream-2 p-6"
                >
                  {t.quote ? (
                    <blockquote className="font-serif text-lg leading-snug">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                  ) : (
                    <div>
                      <span className="inline-block rounded-full bg-coal/10 px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-coal/60">
                        Real quote pending
                      </span>
                      <p className="mt-3 text-sm italic text-coal/50">
                        We only publish genuine client words. This space is
                        reserved for {t.company}.
                      </p>
                    </div>
                  )}
                  <figcaption className="mt-4 border-t border-coal/10 pt-3 text-sm text-coal/70">
                    {t.name ? `${t.name}, ` : ""}
                    {t.company} · {t.town}
                  </figcaption>
                </figure>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
              {["UK-based", "No long contracts", "Built for trades", "Fast turnaround"].map(
                (b) => (
                  <span
                    key={b}
                    className="inline-flex items-center gap-1.5 rounded-full border border-coal/15 px-4 py-2 text-sm font-medium"
                  >
                    <ShieldCheck className="size-4 text-lime-deep" aria-hidden />
                    {b}
                  </span>
                ),
              )}
            </div>

            {guarantee && (
              <p className="mx-auto mt-8 max-w-xl rounded-2xl border border-coal/15 bg-cream-2 p-5 text-center text-sm leading-relaxed">
                {guarantee}
              </p>
            )}
          </div>
        </section>

        {/* ── 7. FAQ ── */}
        <section className="px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-center text-2xl font-extrabold tracking-tight sm:text-4xl">
              Fair questions, straight answers.
            </h2>
            <div className="mt-8">
              {faqs.map((f) => (
                <details key={f.q} className="group border-b border-line py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-bold text-mist sm:text-lg">
                    {f.q}
                    <Sparkles className="size-4 shrink-0 text-lime transition-transform duration-200 group-open:rotate-90" aria-hidden />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. FINAL CTA ── */}
        <section className="grain relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(201,247,58,0.14), transparent 65%)",
            }}
            aria-hidden
          />
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="font-display text-[clamp(1.8rem,6vw,3.2rem)] font-extrabold leading-[1.05] tracking-tight">
              Your next job is searching{" "}
              <em className="font-serif italic font-normal text-lime">right now.</em>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-muted">
              15 minutes. A free plan for your roofing business. No hard sell.
            </p>
            <div className="mt-7">
              <CtaButton label="Book my free call" />
            </div>
          </div>
        </section>
      </main>

      {/* ── 9. FOOTER ── */}
      <footer className="border-t border-line px-4 py-10 pb-24 sm:px-6 md:pb-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <p className="font-display text-lg font-extrabold tracking-tight">
              Shan<span className="text-lime">.</span>
              <span className="ml-2 font-label text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
                Digital Marketing
              </span>
            </p>
            <div className="flex flex-col gap-2 text-sm text-muted sm:items-end">
              <a href={`mailto:${funnel.email}`} className="inline-flex items-center gap-2 hover:text-lime">
                <Mail className="size-4 text-lime" aria-hidden />
                {funnel.email}
              </a>
              {funnel.phone && (
                <a href={`tel:${funnel.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 hover:text-lime">
                  <PhoneCall className="size-4 text-lime" aria-hidden />
                  {funnel.phone}
                </a>
              )}
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-4 text-lime" aria-hidden />
                {site.address.city}, {site.address.country}
              </span>
            </div>
          </div>
          <p className="mt-8 border-t border-line pt-6 text-xs leading-relaxed text-muted">
            {privacyNote}
          </p>
          <p className="mt-4 text-xs text-muted">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
        </div>
      </footer>

      <StickyCTA />
    </div>
  );
}
