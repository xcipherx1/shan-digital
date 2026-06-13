"use client";

import { useRef } from "react";
import { Compass, Users, KeyRound } from "lucide-react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import AnimatedText from "@/components/ui/AnimatedText";
import { about, site } from "@/config/site";

const valueIcons = [Compass, Users, KeyRound];

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-about-line]",
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: root.current, start: "top 65%" },
          },
        );

        // Timeline rail draws as you scroll through the milestones
        gsap.fromTo(
          "[data-timeline-rail]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-timeline]",
              start: "top 70%",
              end: "bottom 55%",
              scrub: 0.5,
            },
          },
        );

        gsap.utils.toArray<HTMLElement>("[data-milestone]").forEach((el) => {
          gsap.fromTo(
            el,
            { x: -32, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 78%" },
            },
          );
        });

        gsap.fromTo(
          "[data-value-card]",
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: "[data-values]", start: "top 78%" },
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
      id="about"
      className="on-light scroll-mt-20 bg-cream px-5 py-24 text-coal sm:px-8 md:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <p className="mb-8 font-label text-xs font-medium uppercase tracking-[0.25em] text-coal/60">
          About the agency · since {site.founded}
        </p>

        <h2 className="font-display text-[clamp(2.2rem,6vw,5rem)] font-extrabold leading-[1.02] tracking-tight">
          <span className="block overflow-hidden pb-1">
            <span data-about-line className="block">
              Not another agency.
            </span>
          </span>
          <span className="block overflow-hidden pb-2">
            <span data-about-line className="block">
              Your{" "}
              <em className="font-serif italic font-normal">
                growth department.
              </em>
            </span>
          </span>
        </h2>

        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
          {about.story.map((para) => (
            <AnimatedText
              key={para.slice(0, 24)}
              text={para}
              highlight="marker"
              className="max-w-xl text-lg leading-relaxed sm:text-xl"
            />
          ))}
        </div>

        {/* Legacy timeline */}
        <div data-timeline className="relative mt-20 md:mt-28">
          <p className="mb-10 font-label text-xs font-medium uppercase tracking-[0.25em] text-coal/60">
            The story so far
          </p>
          <div className="relative">
            <span
              className="absolute left-[7px] top-1 hidden h-full w-px bg-coal/15 sm:block"
              aria-hidden
            />
            <span
              data-timeline-rail
              className="absolute left-[7px] top-1 hidden h-full w-px origin-top bg-coal sm:block"
              aria-hidden
            />
            <ol className="space-y-12 sm:pl-12">
              {about.milestones.map((m) => (
                <li key={m.year} data-milestone className="relative">
                  <span
                    className="absolute -left-12 top-1.5 hidden size-[15px] rounded-full border-[3px] border-cream bg-coal sm:block"
                    aria-hidden
                  />
                  <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-14">
                    <span className="font-display shrink-0 text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold leading-none tracking-tight text-coal/25 md:w-36">
                      {m.year}
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
                        {m.title}
                      </h3>
                      <p className="mt-2 max-w-xl text-sm leading-relaxed text-coal/70 sm:text-base">
                        {m.body}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Values */}
        <div data-values className="mt-20 grid gap-5 md:mt-28 md:grid-cols-3">
          {about.values.map((v, i) => {
            const Icon = valueIcons[i % valueIcons.length];
            return (
              <div
                key={v.title}
                data-value-card
                className="group rounded-3xl border border-coal/12 bg-cream-2 p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-coal/35 hover:shadow-[0_24px_48px_-24px_rgba(20,21,15,0.4)]"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-coal text-lime transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="font-display mt-5 text-lg font-bold tracking-tight">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-coal/70">{v.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
