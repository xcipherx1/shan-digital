import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  MapPin,
  MessageCircle,
  PhoneCall,
  Quote,
  X,
} from "lucide-react";
import { site, services } from "@/config/site";
import {
  areasServed,
  servicePageBySlug,
  servicePages,
  servicePageByKey,
  serviceHref,
} from "@/config/service-pages";
import ServiceHeader from "@/components/services/ServiceHeader";
import Footer from "@/components/sections/Footer";

const WA_NUMBER = site.phoneHref.replace(/[^0-9]/g, "");

export function generateStaticParams() {
  return servicePages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = servicePageBySlug[slug];
  if (!page) return {};

  const url = `${site.url}/services/${page.slug}`;
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: [...page.keywords],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "en_GB",
      url,
      siteName: site.name,
      title: page.metaTitle,
      description: page.metaDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
    },
    robots: { index: true, follow: true },
  };
}

function Cta({ label = "Get my free audit" }: { label?: string }) {
  return (
    <Link
      href="/#lead"
      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-lime px-7 py-4 font-display text-base font-bold text-coal transition-colors duration-200 hover:bg-lime-deep"
    >
      {label}
      <ArrowRight className="size-5" aria-hidden />
    </Link>
  );
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = servicePageBySlug[slug];
  if (!page) notFound();

  const service = services.find((s) => s.key === page.key)!;
  const url = `${site.url}/services/${page.slug}`;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.title,
    description: page.metaDescription,
    url,
    provider: {
      "@type": "ProfessionalService",
      name: site.name,
      email: site.email,
      telephone: site.phone,
      url: site.url,
      address: {
        "@type": "PostalAddress",
        streetAddress: site.address.street,
        addressLocality: site.address.city,
        postalCode: site.address.postcode,
        addressCountry: "GB",
      },
    },
    areaServed: areasServed.map((a) => ({ "@type": "City", name: a })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.title} deliverables`,
      itemListElement: page.includes.items.map((i) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: i.title },
      })),
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Services", item: `${site.url}/services` },
      { "@type": "ListItem", position: 3, name: service.title, item: url },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="bg-ink text-mist">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <ServiceHeader />

      <main id="top">
        {/* ── Breadcrumb ── */}
        <nav
          aria-label="Breadcrumb"
          className="mx-auto max-w-4xl px-5 pt-8 sm:px-8"
        >
          <ol className="flex flex-wrap items-center gap-1.5 font-label text-[11px] uppercase tracking-wider text-muted">
            <li>
              <Link href="/" className="transition-colors hover:text-lime">
                Home
              </Link>
            </li>
            <ChevronRight className="size-3" aria-hidden />
            <li>
              <Link href="/services" className="transition-colors hover:text-lime">
                Services
              </Link>
            </li>
            <ChevronRight className="size-3" aria-hidden />
            <li aria-current="page" className="text-lime">
              {page.navLabel}
            </li>
          </ol>
        </nav>

        {/* ── Hero ── */}
        <section className="grain relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 110%, rgba(201,247,58,0.1), transparent 62%)",
            }}
            aria-hidden
          />
          <div className="relative mx-auto max-w-4xl px-5 pb-14 pt-8 sm:px-8 sm:pb-20 sm:pt-10">
            <p className="font-label text-[11px] uppercase tracking-[0.22em] text-lime">
              {page.eyebrow}
            </p>
            <h1 className="font-display mt-4 text-[clamp(2rem,6vw,3.6rem)] font-extrabold leading-[1.05] tracking-tight">
              {page.h1}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              {page.heroSub}
            </p>

            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
              {page.heroBullets.map((b) => (
                <li key={b} className="inline-flex items-center gap-2 text-sm text-mist">
                  <Check className="size-4 shrink-0 text-lime" aria-hidden />
                  {b}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Cta />
              <a
                href={`tel:${site.phoneHref}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-mist transition-colors hover:text-lime"
              >
                <PhoneCall className="size-4 text-lime" aria-hidden />
                {site.phone}
              </a>
              <a
                href={`https://wa.me/${WA_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-mist transition-colors hover:text-lime"
              >
                <MessageCircle className="size-4 text-lime" aria-hidden />
                WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* ── Problem ── */}
        <section className="on-light bg-cream px-5 py-14 text-coal sm:px-8 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              {page.problem.heading}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-coal/75 sm:text-lg">
              {page.problem.intro}
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {page.problem.pains.map((p) => (
                <li
                  key={p}
                  className="flex items-start gap-3 rounded-2xl border border-coal/12 bg-cream-2 p-4 text-sm leading-relaxed"
                >
                  <X className="mt-0.5 size-4 shrink-0 text-red-500/70" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── What's included ── */}
        <section className="px-5 py-14 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-4xl">
              {page.includes.heading}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
              {page.includes.intro}
            </p>
            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              {page.includes.items.map((item) => (
                <article
                  key={item.title}
                  className="rounded-3xl border border-line bg-ink-2 p-6 transition-colors duration-300 hover:border-lime/40"
                >
                  <h3 className="font-display flex items-start gap-2.5 text-lg font-bold tracking-tight">
                    <Check className="mt-1 size-4 shrink-0 text-lime" aria-hidden />
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Process ── */}
        <section className="px-5 pb-14 sm:px-8 sm:pb-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-4xl">
              {page.process.heading}
            </h2>
            <ol className="mt-9 space-y-4">
              {page.process.steps.map((step, i) => (
                <li
                  key={step.title}
                  className="flex flex-col gap-3 rounded-3xl border border-line bg-ink-2 p-6 sm:flex-row sm:items-start sm:gap-7"
                >
                  <span className="font-display shrink-0 text-2xl font-extrabold leading-none text-lime sm:w-14 sm:text-3xl">
                    0{i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-display text-lg font-bold tracking-tight">
                        {step.title}
                      </h3>
                      <span className="rounded-full border border-line px-3 py-1 font-label text-[10px] uppercase tracking-wider text-muted">
                        {step.when}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Proof (only when a real result exists) ── */}
        {page.proof && (
          <section className="px-5 pb-14 sm:px-8 sm:pb-20">
            <div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-line bg-ink-2 p-7 sm:p-10">
              <Quote className="size-7 text-lime" aria-hidden />
              <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
                <div className="shrink-0">
                  <p className="font-display text-4xl font-extrabold tracking-tight text-lime sm:text-5xl">
                    {page.proof.value}
                  </p>
                  <p className="mt-1 text-sm text-muted">{page.proof.label}</p>
                </div>
                <div>
                  <p className="text-base leading-relaxed text-mist">
                    {page.proof.summary}
                  </p>
                  <p className="mt-3 font-label text-xs uppercase tracking-wider text-muted">
                    {page.proof.client}
                  </p>
                  {page.proof.href && (
                    <a
                      href={page.proof.href}
                      {...(page.proof.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="mt-3 inline-flex items-center gap-1.5 font-display text-sm font-bold text-lime transition-colors hover:text-mist"
                    >
                      See the work
                      <ArrowUpRight className="size-4" aria-hidden />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Why us ── */}
        <section className="on-light bg-cream px-5 py-14 text-coal sm:px-8 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-4xl">
              {page.whyUs.heading}
            </h2>
            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              {page.whyUs.points.map((p) => (
                <div
                  key={p.title}
                  className="rounded-3xl border border-coal/12 bg-cream-2 p-6"
                >
                  <h3 className="font-display text-lg font-bold tracking-tight">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-coal/75">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Areas served (local relevance) ── */}
        <section className="px-5 py-14 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              {service.title} across Bristol and the South West
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
              We are based at {site.address.street} in {site.address.city} and
              work with businesses across the region and the wider UK. Everything
              is delivered remotely with regular calls, so where you are matters
              far less than whether we can win your area.
            </p>
            <ul className="mt-7 flex flex-wrap gap-2">
              {areasServed.map((area) => (
                <li
                  key={area}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm text-muted"
                >
                  <MapPin className="size-3.5 text-lime" aria-hidden />
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Related services (internal linking) ── */}
        <section className="px-5 pb-14 sm:px-8 sm:pb-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              Works well with
            </h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {page.related.map((key) => {
                const rel = servicePageByKey[key];
                const relService = services.find((s) => s.key === key)!;
                return (
                  <Link
                    key={key}
                    href={serviceHref(key)}
                    className="group rounded-3xl border border-line bg-ink-2 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-lime/40"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-display text-lg font-bold tracking-tight">
                        {relService.title}
                      </h3>
                      <ArrowUpRight
                        className="size-4 shrink-0 text-muted transition-colors group-hover:text-lime"
                        aria-hidden
                      />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {rel.heroSub}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="on-light bg-cream px-5 py-14 text-coal sm:px-8 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-4xl">
              {page.navLabel} questions, answered
            </h2>
            <div className="mt-8">
              {page.faqs.map((f) => (
                <details key={f.q} className="group border-b border-coal/12 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-bold sm:text-lg">
                    {f.q}
                    <ChevronRight
                      className="size-4 shrink-0 text-lime-deep transition-transform duration-200 group-open:rotate-90"
                      aria-hidden
                    />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-coal/75 sm:text-base">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="grain relative overflow-hidden px-5 py-16 sm:px-8 sm:py-24">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(201,247,58,0.13), transparent 65%)",
            }}
            aria-hidden
          />
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="font-display text-[clamp(1.8rem,5.5vw,3rem)] font-extrabold leading-[1.05] tracking-tight">
              {page.cta.heading}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted">
              {page.cta.body}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
              <Cta />
              <a
                href={`tel:${site.phoneHref}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-mist transition-colors hover:text-lime"
              >
                <PhoneCall className="size-4 text-lime" aria-hidden />
                {site.phone}
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
