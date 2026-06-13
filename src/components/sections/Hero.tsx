"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  MapPin,
  Star,
  TrendingUp,
} from "lucide-react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { oncePreloaderDone } from "@/lib/preloader";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import MagneticButton from "@/components/ui/MagneticButton";
import { hero, reviews } from "@/config/site";

const heroUsps = [
  "Map pack top 3 rankings",
  "0.8s lightning-fast sites",
  "5.0 from 40+ UK clients",
  "No long lock-in contracts",
] as const;

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
});

/** Splits a phrase into per-character spans inside masked word blocks. */
function Chars({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, w) => (
        <span
          key={w}
          className="mr-[0.24em] inline-flex overflow-hidden pb-[0.08em] last:mr-0 align-bottom"
        >
          {word.split("").map((ch, c) => (
            <span key={c} data-char className="inline-block will-change-transform">
              {ch}
            </span>
          ))}
        </span>
      ))}
    </>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const showScene = !usePrefersReducedMotion();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        tl.current = gsap
          .timeline({ paused: true, defaults: { ease: "power3.out" } })
          .fromTo(
            "[data-char]",
            { yPercent: 120, rotate: 6 },
            { yPercent: 0, rotate: 0, duration: 0.8, stagger: 0.018 },
            0,
          )
          .fromTo(
            "[data-hero-serif]",
            { yPercent: 120 },
            { yPercent: 0, duration: 0.9 },
            0.45,
          )
          .fromTo(
            "[data-hero-eyebrow], [data-hero-trust]",
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
            0.55,
          )
          .fromTo(
            "[data-hero-sub], [data-hero-cta]",
            { y: 28, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.12 },
            0.75,
          )
          .fromTo(
            "[data-hero-chip]",
            { y: 32, opacity: 0, scale: 0.9 },
            { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.12, ease: "back.out(1.6)" },
            1,
          )
          .fromTo(
            "[data-hero-stat]",
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.55, stagger: 0.08 },
            1.1,
          );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  useEffect(() => {
    // Intro waits for the preloader curtain; starts just before it fully lifts.
    return oncePreloaderDone(() => tl.current?.play(0));
  }, []);

  const avatars = reviews.slice(0, 4);

  return (
    <section
      ref={root}
      id="top"
      className="grain relative flex min-h-dvh flex-col overflow-hidden bg-ink"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 118%, rgba(201,247,58,0.14), transparent 60%), radial-gradient(ellipse 55% 40% at 85% -5%, rgba(45,212,191,0.1), transparent 55%)",
        }}
        aria-hidden
      />
      {showScene && (
        <div className="absolute inset-x-0 bottom-0 h-[62%]" aria-hidden>
          <HeroScene />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink to-transparent" />
        </div>
      )}

      {/* Floating proof chip */}
      <div
        data-hero-chip
        className="animate-float-soft absolute right-[6%] top-[18%] z-10 hidden items-center gap-3 rounded-2xl border border-line bg-ink-2/80 px-4 py-3 backdrop-blur-md lg:flex"
      >
        <span className="flex size-9 items-center justify-center rounded-xl bg-lime/15 text-lime">
          <TrendingUp className="size-4" aria-hidden />
        </span>
        <span>
          <span className="block font-display text-base font-bold text-mist">+212%</span>
          <span className="block text-[11px] text-muted">enquiry calls, 6 months</span>
        </span>
      </div>

      {/* Floating USP card */}
      <div
        data-hero-chip
        className="animate-float-soft absolute right-[8%] top-[46%] z-10 hidden w-60 flex-col gap-3 rounded-2xl border border-line bg-ink-2/80 p-4 backdrop-blur-md xl:flex"
        style={{ animationDelay: "-2.4s" }}
      >
        <span className="flex items-center gap-2 font-label text-[10px] font-semibold uppercase tracking-[0.2em] text-lime">
          <span className="size-1.5 rounded-full bg-lime" aria-hidden />
          Why local firms pick us
        </span>
        <ul className="space-y-2.5">
          {heroUsps.map((usp) => (
            <li key={usp} className="flex items-center gap-2.5 text-[13px] text-mist">
              <Check className="size-3.5 shrink-0 text-lime" aria-hidden />
              {usp}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 pb-24 pt-32 sm:px-8 md:pt-36">
        <p
          data-hero-eyebrow
          className="mb-6 inline-flex w-fit items-center gap-2.5 rounded-full border border-line bg-ink-2/70 px-4 py-2 font-label text-[11px] font-medium uppercase tracking-[0.22em] text-muted backdrop-blur"
        >
          <span className="animate-pulse-dot size-1.5 rounded-full bg-lime" aria-hidden />
          {hero.eyebrow}
        </p>

        <h1 className="font-display max-w-5xl text-[clamp(2.5rem,7.6vw,6.2rem)] font-extrabold leading-[1.02] tracking-tight text-mist">
          <span className="block">
            <Chars text="We make local" />
          </span>
          <span className="block">
            <Chars text="businesses" />
            <span className="ml-[0.18em] hidden align-middle sm:inline-flex">
              <span className="inline-flex h-[0.85em] items-center gap-2 rounded-full bg-lime px-[0.4em] text-[0.32em] font-bold uppercase tracking-wider text-coal">
                <MapPin className="size-[1.2em]" aria-hidden />
                Bristol → UK
              </span>
            </span>
          </span>
          <span className="block overflow-hidden pb-2">
            <span data-hero-serif className="block">
              <em className="font-serif italic font-normal text-lime">
                impossible to ignore.
              </em>
            </span>
          </span>
        </h1>

        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
          <p
            data-hero-sub
            className="max-w-md text-base leading-relaxed text-muted sm:text-lg"
          >
            Local SEO, brand, websites and custom software, engineered as one
            system that turns searches into booked work.
          </p>

          <div data-hero-trust className="flex items-center gap-4">
            <span className="flex -space-x-2.5" aria-hidden>
              {avatars.map((r) => (
                <span
                  key={r.initials}
                  className="flex size-9 items-center justify-center rounded-full border-2 border-ink bg-ink-3 font-label text-[10px] font-bold text-lime"
                >
                  {r.initials}
                </span>
              ))}
            </span>
            <span>
              <span className="flex items-center gap-1" aria-label={`Rated ${hero.rating.score} out of 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-lime text-lime" aria-hidden />
                ))}
                <span className="ml-1.5 font-display text-sm font-bold text-mist">
                  {hero.rating.score}
                </span>
              </span>
              <span className="mt-0.5 block text-xs text-muted">
                rated by {hero.rating.count}
              </span>
            </span>
          </div>
        </div>

        <div data-hero-cta className="mt-9 flex flex-wrap items-center gap-4">
          <MagneticButton
            href="#lead"
            className="rounded-full bg-lime px-8 py-4 font-display text-base font-bold text-coal hover:bg-lime-deep"
          >
            Get your free SEO audit
            <ArrowUpRight className="size-5" aria-hidden />
          </MagneticButton>
          <MagneticButton
            href="#work"
            className="rounded-full border border-line px-8 py-4 font-display text-base font-bold text-mist hover:border-lime hover:text-lime"
          >
            See the work
          </MagneticButton>
        </div>
      </div>

      {/* Stat bar */}
      <div className="relative z-10 border-t border-line bg-ink/60 backdrop-blur-sm">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-x-6 gap-y-5 px-5 py-6 sm:px-8 lg:grid-cols-4">
          {hero.statBar.map((s) => (
            <div key={s.label} data-hero-stat className="flex items-baseline gap-3">
              <span className="font-display text-2xl font-extrabold tracking-tight text-lime sm:text-3xl">
                {s.value}
              </span>
              <span className="text-xs leading-tight text-muted sm:text-sm">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-28 right-6 z-10 hidden size-11 items-center justify-center rounded-full border border-line text-muted transition-colors duration-200 hover:border-lime hover:text-lime lg:inline-flex"
        aria-label="Scroll to about section"
      >
        <ArrowDown className="animate-scroll-cue size-4" aria-hidden />
      </a>
    </section>
  );
}
