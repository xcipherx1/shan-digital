"use client";

import { useRef } from "react";
import {
  MapPin,
  PenTool,
  LayoutDashboard,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { services, type ServiceKey } from "@/config/site";

const icons: Record<ServiceKey, LucideIcon> = {
  seo: MapPin,
  brand: PenTool,
  saas: LayoutDashboard,
  web: Globe,
};

/** Asymmetric bento spans: SEO and Web get the wide cards. */
const spans: Record<ServiceKey, string> = {
  seo: "md:col-span-7",
  brand: "md:col-span-5",
  saas: "md:col-span-5",
  web: "md:col-span-7",
};

export default function Services() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-service-card]",
          { y: 56, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: root.current, start: "top 70%" },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="services"
      className="grain relative scroll-mt-20 bg-ink px-5 py-24 sm:px-8 md:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-lime">
              What we build
            </p>
            <h2 className="font-display max-w-2xl text-[clamp(2rem,5vw,3.75rem)] font-bold leading-[1.05] tracking-tight text-mist">
              One agency.{" "}
              <em className="font-serif italic font-normal text-lime">
                The whole system.
              </em>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted md:text-base">
            Four disciplines, engineered to work as one, so every pound you
            spend feeds the same growth engine.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-12">
          {services.map((service) => {
            const Icon = icons[service.key];
            return (
              <article
                key={service.key}
                data-service-card
                className={`group relative overflow-hidden rounded-3xl border border-line bg-ink-2 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-lime/40 sm:p-9 ${spans[service.key]}`}
              >
                <div
                  className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: "rgba(201,247,58,0.12)" }}
                  aria-hidden
                />
                <div className="mb-10 flex items-start justify-between">
                  <span className="inline-flex size-12 items-center justify-center rounded-2xl border border-line bg-ink-3 text-lime">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="font-display text-sm font-medium text-muted">
                    {service.index}
                  </span>
                </div>
                <h3 className="font-display text-2xl font-semibold tracking-tight text-mist sm:text-3xl">
                  {service.title}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
                  {service.blurb}
                </p>
                <ul className="mt-7 flex flex-wrap gap-2">
                  {service.deliverables.map((d) => (
                    <li
                      key={d}
                      className="rounded-full border border-line px-3.5 py-1.5 text-xs text-muted transition-colors duration-200 group-hover:border-lime/30 group-hover:text-mist"
                    >
                      {d}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
