import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ChevronRight, MapPin, PhoneCall } from "lucide-react";
import { services, site } from "@/config/site";
import { areasServed, servicePageByKey, serviceHref } from "@/config/service-pages";
import ServiceHeader from "@/components/services/ServiceHeader";
import Footer from "@/components/sections/Footer";

const title = "Our Services | Local SEO, Google Ads & Web Design in Bristol";
const description =
  "Local SEO, Google Ads, branding, custom software and website design for UK trades and SMEs. Bristol based, working across the South West and the wider UK.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "digital marketing services Bristol",
    "local SEO Bristol",
    "Google Ads management Bristol",
    "web design Bristol",
    "branding agency Bristol",
    "custom software Bristol",
  ],
  alternates: { canonical: `${site.url}/services` },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: `${site.url}/services`,
    siteName: site.name,
    title,
    description,
  },
  robots: { index: true, follow: true },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: site.url },
    { "@type": "ListItem", position: 2, name: "Services", item: `${site.url}/services` },
  ],
};

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: services.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: s.title,
    url: `${site.url}${serviceHref(s.key)}`,
  })),
};

export default function ServicesIndexPage() {
  return (
    <div className="bg-ink text-mist">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <ServiceHeader />

      <main id="top">
        <nav aria-label="Breadcrumb" className="mx-auto max-w-5xl px-5 pt-8 sm:px-8">
          <ol className="flex items-center gap-1.5 font-label text-[11px] uppercase tracking-wider text-muted">
            <li>
              <Link href="/" className="transition-colors hover:text-lime">
                Home
              </Link>
            </li>
            <ChevronRight className="size-3" aria-hidden />
            <li aria-current="page" className="text-lime">
              Services
            </li>
          </ol>
        </nav>

        <section className="grain relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 115%, rgba(201,247,58,0.1), transparent 62%)",
            }}
            aria-hidden
          />
          <div className="relative mx-auto max-w-5xl px-5 pb-12 pt-8 sm:px-8 sm:pb-16 sm:pt-10">
            <p className="font-label text-[11px] uppercase tracking-[0.22em] text-lime">
              What we do
            </p>
            <h1 className="font-display mt-4 max-w-3xl text-[clamp(2rem,6vw,3.6rem)] font-extrabold leading-[1.05] tracking-tight">
              Everything that gets a local business found and booked
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              Five disciplines that work as one system. Most clients start with
              one and add the others as the first pays for itself.
            </p>
          </div>
        </section>

        <section className="px-5 pb-14 sm:px-8 sm:pb-20">
          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">
            {services.map((s) => {
              const page = servicePageByKey[s.key];
              return (
                <Link
                  key={s.key}
                  href={serviceHref(s.key)}
                  className="group flex flex-col rounded-3xl border border-line bg-ink-2 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-lime/40"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-label text-[11px] uppercase tracking-[0.2em] text-lime">
                      {s.index}
                    </span>
                    <ArrowUpRight
                      className="size-5 shrink-0 text-muted transition-colors group-hover:text-lime"
                      aria-hidden
                    />
                  </div>
                  <h2 className="font-display mt-4 text-xl font-bold tracking-tight sm:text-2xl">
                    {s.title}
                  </h2>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted">
                    {page.heroSub}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 font-display text-sm font-bold text-lime">
                    {page.navLabel} details
                    <ArrowUpRight className="size-4" aria-hidden />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="on-light bg-cream px-5 py-14 text-coal sm:px-8 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              Where we work
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-coal/75">
              Based in {site.address.city}, working across the South West and the
              wider UK.
            </p>
            <ul className="mt-7 flex flex-wrap gap-2">
              {areasServed.map((area) => (
                <li
                  key={area}
                  className="inline-flex items-center gap-1.5 rounded-full border border-coal/15 bg-cream-2 px-4 py-2 text-sm"
                >
                  <MapPin className="size-3.5 text-lime-deep" aria-hidden />
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </section>

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
              Not sure which you need?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted">
              Start with the free audit. We will tell you where the biggest gap
              is, even if the answer is that you do not need us yet.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
              <Link
                href="/#lead"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-lime px-7 py-4 font-display text-base font-bold text-coal transition-colors duration-200 hover:bg-lime-deep"
              >
                Get my free audit
              </Link>
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
