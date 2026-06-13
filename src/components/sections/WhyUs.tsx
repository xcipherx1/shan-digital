"use client";

import { useRef } from "react";
import { Check, X, ShieldCheck } from "lucide-react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { comparison, site } from "@/config/site";

export default function WhyUs() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-compare-row]",
          { x: -28, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.55,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: "[data-compare]", start: "top 75%" },
          },
        );
        gsap.fromTo(
          "[data-guarantee]",
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: "[data-guarantees]", start: "top 85%" },
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
      id="why-us"
      className="on-light scroll-mt-20 bg-cream px-5 py-24 text-coal sm:px-8 md:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <p className="mb-4 font-label text-xs font-medium uppercase tracking-[0.25em] text-coal/60">
          Why businesses choose us
        </p>
        <h2 className="font-display max-w-3xl text-[clamp(2rem,5vw,3.75rem)] font-extrabold leading-[1.05] tracking-tight">
          The agency test most agencies{" "}
          <em className="font-serif italic font-normal">fail.</em>
        </h2>

        <div data-compare className="mt-12 overflow-hidden rounded-[2rem] border border-coal/12 bg-cream-2">
          {/* Header */}
          <div className="grid grid-cols-[1fr_4.5rem_4.5rem] items-center gap-3 border-b border-coal/10 px-5 py-4 sm:grid-cols-[1fr_8rem_8rem] sm:px-8">
            <span className="font-label text-[10px] uppercase tracking-[0.22em] text-coal/50 sm:text-xs">
              What to demand
            </span>
            <span className="text-center font-display text-sm font-extrabold sm:text-base">
              {site.shortName}
              <span className="text-lime-deep">.</span>
            </span>
            <span className="text-center font-label text-[10px] uppercase tracking-wider text-coal/50 sm:text-xs">
              Typical agency
            </span>
          </div>

          {comparison.rows.map((row) => (
            <div
              key={row.criterion}
              data-compare-row
              className="grid grid-cols-[1fr_4.5rem_4.5rem] items-center gap-3 border-b border-coal/8 px-5 py-4 last:border-b-0 sm:grid-cols-[1fr_8rem_8rem] sm:px-8"
            >
              <span className="text-sm leading-snug sm:text-base">{row.criterion}</span>
              <span className="flex justify-center">
                {row.us ? (
                  <span className="flex size-7 items-center justify-center rounded-full bg-coal text-lime">
                    <Check className="size-4" aria-label="Yes" />
                  </span>
                ) : (
                  <X className="size-4 text-coal/30" aria-label="No" />
                )}
              </span>
              <span className="flex justify-center">
                {row.them ? (
                  <span className="flex size-7 items-center justify-center rounded-full bg-coal/10 text-coal/60">
                    <Check className="size-4" aria-label="Yes" />
                  </span>
                ) : (
                  <X className="size-4 text-coal/30" aria-label="No" />
                )}
              </span>
            </div>
          ))}
        </div>

        <div data-guarantees className="mt-8 flex flex-wrap gap-3">
          {comparison.guarantees.map((g) => (
            <span
              key={g}
              data-guarantee
              className="inline-flex items-center gap-2 rounded-full border border-coal/15 bg-cream-2 px-4 py-2.5 text-sm font-medium"
            >
              <ShieldCheck className="size-4 text-lime-deep" aria-hidden />
              {g}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
