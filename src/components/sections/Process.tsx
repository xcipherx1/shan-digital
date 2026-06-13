"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { processSteps } from "@/config/site";

/**
 * Bold lime section with sticky-stacking step cards: each card pins
 * under the heading while the next one slides over it.
 */
export default function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils
          .toArray<HTMLElement>("[data-step-card]")
          .forEach((card, i, cards) => {
            if (i === cards.length - 1) return;
            gsap.to(card, {
              scale: 0.94,
              opacity: 0.65,
              ease: "none",
              scrollTrigger: {
                trigger: cards[i + 1],
                start: "top bottom",
                end: "top top+=120",
                scrub: true,
              },
            });
          });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="process"
      className="on-light scroll-mt-20 bg-lime px-5 py-24 text-coal sm:px-8 md:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 md:mb-20">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-coal/60">
            The process
          </p>
          <h2 className="font-display max-w-3xl text-[clamp(2rem,5.5vw,4.25rem)] font-bold leading-[1.02] tracking-tight">
            How we put your business{" "}
            <em className="font-serif italic font-normal">on the map.</em>
          </h2>
        </div>

        <ol className="space-y-6">
          {processSteps.map((step) => (
            <li
              key={step.index}
              data-step-card
              className="sticky top-24 rounded-3xl border border-coal/15 bg-cream p-7 shadow-[0_24px_60px_-30px_rgba(20,21,15,0.35)] sm:p-10 md:top-28"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-12">
                <span className="font-display text-[clamp(2.6rem,6vw,4.5rem)] font-extrabold leading-none text-coal/15">
                  {step.index}
                </span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                      {step.title}
                    </h3>
                    <span className="rounded-full bg-coal px-3.5 py-1.5 font-label text-[11px] font-bold uppercase tracking-wider text-lime">
                      {step.duration}
                    </span>
                  </div>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-coal/70 sm:text-base">
                    {step.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
