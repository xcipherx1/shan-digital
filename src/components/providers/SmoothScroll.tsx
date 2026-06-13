"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Global smooth-scroll layer. Lenis rAF-interpolates the scroll
 * position so wheel/trackpad input glides instead of jumping, which
 * removes the portfolio stutter. We let Lenis own its rAF loop (its
 * internal clock yields correct frame deltas) and push every scroll
 * frame into ScrollTrigger so scrubbed animations stay in lockstep.
 * Disabled entirely for reduced-motion users.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      // expo-style easing for a weighty, premium glide
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
      autoRaf: true,
    });

    if (process.env.NODE_ENV === "development") {
      (window as unknown as Record<string, unknown>).__lenis = lenis;
    }

    // Keep ScrollTrigger perfectly in sync with Lenis' scroll position
    lenis.on("scroll", ScrollTrigger.update);

    // Smoothly animate in-page anchor links (nav, CTAs, footer)
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      const href = link?.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      // negative offset clears the fixed header (~80px)
      lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 1.2 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  return null;
}
