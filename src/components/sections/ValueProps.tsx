"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import AnimatedText from "@/components/ui/AnimatedText";
import { valueProps } from "@/config/site";

export default function ValueProps() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-value-prop]",
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: "[data-value-grid]", start: "top 78%" },
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
      id="value"
      className="grain relative scroll-mt-20 bg-ink px-5 py-24 sm:px-8 md:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <p className="mb-4 font-label text-xs font-medium uppercase tracking-[0.25em] text-lime">
          The value we bring
        </p>
        <h2 className="font-display max-w-3xl text-[clamp(2rem,5vw,3.75rem)] font-extrabold leading-[1.05] tracking-tight text-mist">
          Marketing you{" "}
          <em className="font-serif italic font-normal text-lime">own,</em> not
          rent.
        </h2>

        <AnimatedText
          text="Ads stop the moment you stop paying. We build **assets**, rankings, brand, website and software, that keep **compounding** while your competitors keep renting attention."
          className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl"
        />

        <div data-value-grid className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {valueProps.map((v, i) => (
            <div
              key={v.title}
              data-value-prop
              className="group relative overflow-hidden rounded-3xl border border-line bg-ink-2 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-lime/40"
            >
              <span className="font-display text-sm font-bold text-lime">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display mt-4 text-xl font-bold tracking-tight text-mist">
                {v.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">{v.body}</p>
              <span
                className="pointer-events-none absolute -bottom-10 -right-10 size-28 rounded-full bg-lime/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
