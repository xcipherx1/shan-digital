"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { services, type ServiceKey } from "@/config/site";

/**
 * Deep-dive panel for each service: sticky selector on desktop,
 * swipeable pill row on mobile. Panel content cross-fades via GSAP.
 */
export default function ServiceDetails() {
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<ServiceKey>("seo");
  const service = services.find((s) => s.key === active)!;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-detail-reveal]",
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: root.current, start: "top 72%" },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  function select(key: ServiceKey) {
    if (key === active || !panel.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setActive(key);
      return;
    }
    gsap.to(panel.current, {
      opacity: 0,
      y: 14,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => {
        setActive(key);
        gsap.fromTo(
          panel.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" },
        );
      },
    });
  }

  return (
    <section
      ref={root}
      id="service-details"
      className="on-light scroll-mt-20 bg-cream px-5 py-24 text-coal sm:px-8 md:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <div data-detail-reveal className="mb-12 md:mb-16">
          <p className="mb-4 font-label text-xs font-medium uppercase tracking-[0.25em] text-coal/60">
            Service deep-dive
          </p>
          <h2 className="font-display max-w-3xl text-[clamp(2rem,5vw,3.75rem)] font-extrabold leading-[1.05] tracking-tight">
            Exactly what you get,{" "}
            <em className="font-serif italic font-normal">in writing.</em>
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-14">
          {/* Selector */}
          <div
            data-detail-reveal
            role="tablist"
            aria-label="Choose a service"
            aria-orientation="vertical"
            className="flex gap-2 overflow-x-auto pb-2 lg:sticky lg:top-28 lg:h-fit lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {services.map((s) => {
              const selected = s.key === active;
              return (
                <button
                  key={s.key}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  onClick={() => select(s.key)}
                  className={`group flex shrink-0 cursor-pointer items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-200 ${
                    selected
                      ? "border-coal bg-coal text-cream"
                      : "border-coal/15 bg-transparent text-coal hover:border-coal/40"
                  }`}
                >
                  <span>
                    <span className={`block font-label text-[10px] uppercase tracking-[0.2em] ${selected ? "text-lime" : "text-coal/50"}`}>
                      {s.index}
                    </span>
                    <span className="font-display mt-0.5 block text-base font-bold leading-tight">
                      {s.title}
                    </span>
                    <span className={`mt-0.5 hidden text-xs lg:block ${selected ? "text-cream/60" : "text-coal/55"}`}>
                      {s.short}
                    </span>
                  </span>
                  <ArrowUpRight
                    className={`hidden size-4 shrink-0 transition-transform duration-200 lg:block ${
                      selected ? "text-lime" : "text-coal/40 group-hover:translate-x-0.5"
                    }`}
                    aria-hidden
                  />
                </button>
              );
            })}
          </div>

          {/* Panel */}
          <div
            ref={panel}
            data-detail-reveal
            role="tabpanel"
            className="rounded-[2rem] border border-coal/12 bg-cream-2 p-7 sm:p-10"
          >
            <h3 className="font-display text-[clamp(1.6rem,3.2vw,2.6rem)] font-extrabold leading-[1.08] tracking-tight">
              {service.detail.headline}
            </h3>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-coal/75 sm:text-lg">
              {service.detail.body}
            </p>

            <div className="mt-9 grid gap-9 md:grid-cols-[1fr_auto] md:gap-12">
              <div>
                <p className="mb-4 font-label text-xs font-medium uppercase tracking-[0.22em] text-coal/55">
                  What&apos;s included
                </p>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {service.detail.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm leading-snug text-coal/85">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-coal text-lime">
                        <Check className="size-3" aria-hidden />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex h-fit flex-col rounded-3xl bg-coal p-6 text-cream md:w-56">
                <span className="font-display text-4xl font-extrabold leading-none text-lime">
                  {service.detail.outcome.value}
                </span>
                <span className="mt-2 text-xs leading-relaxed text-cream/70">
                  {service.detail.outcome.label}
                </span>
                <a
                  href="#lead"
                  className="mt-6 inline-flex cursor-pointer items-center gap-1.5 font-display text-sm font-bold text-lime transition-colors duration-200 hover:text-cream"
                >
                  Start with an audit
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
