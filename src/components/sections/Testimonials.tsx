"use client";

import { useRef } from "react";
import { Quote } from "lucide-react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { testimonials } from "@/config/site";

export default function Testimonials() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-quote-card]",
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.14,
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
      className="on-light bg-cream px-5 py-24 text-coal sm:px-8 md:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-coal/60">
          Word of mouth
        </p>
        <h2 className="font-display max-w-2xl text-[clamp(2rem,5vw,3.75rem)] font-bold leading-[1.05] tracking-tight">
          What owners say{" "}
          <em className="font-serif italic font-normal">when it works.</em>
        </h2>

        <div className="mt-14 grid gap-5 md:grid-cols-3 md:gap-6">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              data-quote-card
              className="flex flex-col justify-between rounded-3xl border border-coal/12 bg-cream-2 p-7 sm:p-8"
            >
              <div>
                <Quote className="size-6 text-coal/30" aria-hidden />
                <blockquote className="mt-5 font-serif text-xl leading-snug sm:text-2xl">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </div>
              <figcaption className="mt-8 border-t border-coal/10 pt-5">
                <p className="font-display text-sm font-semibold">{t.name}</p>
                <p className="mt-0.5 text-sm text-coal/60">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
