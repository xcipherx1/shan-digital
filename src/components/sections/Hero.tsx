"use client";

import { useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { ArrowRight, MessageCircle, PhoneCall } from "lucide-react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { oncePreloaderDone } from "@/lib/preloader";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { hero, site } from "@/config/site";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
});

const WA_NUMBER = site.phoneHref.replace(/[^0-9]/g, "");

/** Splits a phrase into per-character spans inside masked word blocks. */
function Chars({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, w) => (
        <span
          key={w}
          className="mr-[0.24em] inline-flex overflow-hidden pb-[0.08em] align-bottom last:mr-0"
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
  const jumpRef = useRef<HTMLAnchorElement>(null);
  const showScene = !usePrefersReducedMotion();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        tl.current = gsap
          .timeline({ paused: true, defaults: { ease: "power3.out" } })
          .fromTo(
            "[data-char]",
            { yPercent: 120 },
            { yPercent: 0, duration: 0.7, stagger: 0.015 },
            0,
          )
          .fromTo(
            "[data-hero-eyebrow]",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5 },
            0.15,
          )
          .fromTo(
            "[data-hero-sub]",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5 },
            0.5,
          )
          .fromTo(
            "[data-hero-form]",
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6 },
            0.62,
          )
          .fromTo(
            "[data-hero-proof]",
            { y: 16, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
            0.8,
          );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  useEffect(() => oncePreloaderDone(() => tl.current?.play(0)), []);

  /**
   * The hero field is a micro-commitment: carry whatever they typed into
   * the full audit form, jump them to it and focus the next empty field,
   * so the one thing they already did is never asked for twice.
   */
  const startAudit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = new FormData(e.currentTarget).get("business")?.toString().trim() ?? "";

    // Route through the hidden anchor so SmoothScroll's delegated handler
    // does the travel: same Lenis easing and header offset as every other
    // CTA, and a plain jump when reduced motion disables Lenis.
    jumpRef.current?.click();

    // The audit tab is the default, so these inputs are present.
    const businessField = document.getElementById("business") as HTMLInputElement | null;
    if (businessField && value) businessField.value = value;

    window.setTimeout(() => {
      const nameField = document.getElementById("name") as HTMLInputElement | null;
      nameField?.focus({ preventScroll: true });
    }, 700);
  }, []);

  return (
    <section
      ref={root}
      id="top"
      className="grain relative flex min-h-dvh flex-col justify-center overflow-hidden bg-ink"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 118%, rgba(201,247,58,0.13), transparent 62%)",
        }}
        aria-hidden
      />
      {showScene && (
        <div className="absolute inset-x-0 bottom-0 h-[55%] opacity-70" aria-hidden>
          <HeroScene />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink to-transparent" />
        </div>
      )}

      {/* pt clears the fixed header (contact bar + nav, ~93-101px) */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-5 pb-10 pt-28 sm:px-8 sm:pb-14 sm:pt-32">
        <p
          data-hero-eyebrow
          className="inline-flex items-center gap-2 rounded-full border border-line bg-ink-2/70 px-3.5 py-1.5 font-label text-[10px] font-medium uppercase tracking-[0.18em] text-muted backdrop-blur sm:text-[11px]"
        >
          <span className="animate-pulse-dot size-1.5 rounded-full bg-lime" aria-hidden />
          {hero.eyebrow}
        </p>

        <h1 className="font-display mt-5 max-w-3xl text-[clamp(2.3rem,7.5vw,4.5rem)] font-extrabold leading-[1.02] tracking-tight text-mist">
          <Chars text="Be the first" />
          <br />
          <Chars text="business" />{" "}
          <span className="inline-flex overflow-hidden pb-[0.08em] align-bottom">
            <em data-char className="inline-block font-serif font-normal italic text-lime">
              they call.
            </em>
          </span>
        </h1>

        <p
          data-hero-sub
          className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
        >
          {hero.subhead}
        </p>

        {/* ── Money action 1: one-field audit start ── */}
        <div data-hero-form className="mt-7 max-w-xl">
          <form onSubmit={startAudit} className="flex flex-col gap-2.5 sm:flex-row">
            <label htmlFor="hero-business" className="sr-only">
              Your business name
            </label>
            <input
              id="hero-business"
              name="business"
              type="text"
              required
              maxLength={120}
              autoComplete="organization"
              placeholder={hero.cta.placeholder}
              className="min-w-0 flex-1 rounded-full border border-line bg-ink-2/80 px-5 py-4 text-base text-mist backdrop-blur placeholder:text-muted/60 focus:border-lime focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-lime px-7 py-4 font-display text-base font-bold text-coal transition-colors duration-200 hover:bg-lime-deep"
            >
              {hero.cta.label}
              <ArrowRight className="size-5" aria-hidden />
            </button>
          </form>

          {/* Programmatic target for the submit handler's scroll. */}
          <a ref={jumpRef} href="#lead" className="sr-only" tabIndex={-1} aria-hidden>
            Continue to the audit form
          </a>

          <p className="mt-2.5 px-1 text-xs text-muted">{hero.cta.reassurance}</p>

          {/* ── Money actions 2 and 3: talk to a human right now ── */}
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 px-1">
            <span className="text-xs text-muted">Prefer to talk?</span>
            <a
              href={`tel:${site.phoneHref}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-mist transition-colors duration-200 hover:text-lime"
            >
              <PhoneCall className="size-4 text-lime" aria-hidden />
              {site.phone}
            </a>
            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-mist transition-colors duration-200 hover:text-lime"
            >
              <MessageCircle className="size-4 text-lime" aria-hidden />
              WhatsApp
            </a>
          </div>
        </div>

        {/* ── Proof: real, attributable client outcomes ── */}
        <dl className="mt-10 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-line pt-6 sm:grid-cols-3">
          {hero.proof.map((p) => (
            <div key={p.client} data-hero-proof>
              <dt className="font-display text-2xl font-extrabold tracking-tight text-lime sm:text-3xl">
                {p.value}
              </dt>
              <dd className="mt-0.5 text-xs leading-snug text-muted sm:text-sm">
                {p.label}
                <span className="mt-0.5 block text-[11px] text-muted/70">
                  {p.client}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
