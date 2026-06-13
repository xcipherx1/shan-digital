"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { markPreloaderDone } from "@/lib/preloader";

/**
 * Full-screen loading sequence: wordmark letters rise while a counter
 * sweeps 0→100, then the curtain lifts. For reduced-motion users the
 * overlay is hidden immediately without any animation.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      if (!root.current) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        root.current.style.display = "none";
        markPreloaderDone();
        return;
      }

      const counter = { n: 0 };
      const counterEl = root.current.querySelector("[data-count]");

      const tl = gsap.timeline({
        onComplete: () => {
          markPreloaderDone();
          setGone(true);
        },
      });

      tl.fromTo(
        "[data-load-letter]",
        { yPercent: 120 },
        {
          yPercent: 0,
          duration: 0.7,
          stagger: 0.055,
          ease: "power3.out",
        },
        0.15,
      )
        .fromTo(
          "[data-load-tag]",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          0.6,
        )
        .to(
          counter,
          {
            n: 100,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => {
              if (counterEl)
                counterEl.textContent = String(Math.round(counter.n)).padStart(
                  3,
                  "0",
                );
            },
          },
          0.2,
        )
        .to(
          "[data-load-bar]",
          { scaleX: 1, duration: 1.5, ease: "power2.inOut" },
          0.2,
        )
        .to(
          "[data-load-letter]",
          { yPercent: -120, duration: 0.5, stagger: 0.04, ease: "power2.in" },
          "+=0.15",
        )
        .to(
          "[data-load-tag], [data-load-meta]",
          { opacity: 0, duration: 0.3 },
          "<",
        )
        .to(root.current, {
          yPercent: -100,
          duration: 0.85,
          ease: "power4.inOut",
        });
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink px-6 py-8 sm:px-10"
      aria-hidden
    >
      <div className="flex items-center justify-between font-label text-xs uppercase tracking-[0.25em] text-muted">
        <span data-load-meta>Bristol, UK</span>
        <span data-load-meta>Growth systems</span>
      </div>

      <div className="flex flex-col items-center">
        <p className="font-display flex overflow-hidden text-[clamp(3rem,14vw,9rem)] font-extrabold leading-none tracking-tight text-mist">
          {"Shan".split("").map((ch, i) => (
            <span key={i} data-load-letter className="inline-block">
              {ch}
            </span>
          ))}
          <span data-load-letter className="inline-block text-lime">
            .
          </span>
        </p>
        <p
          data-load-tag
          className="mt-4 font-label text-xs uppercase tracking-[0.35em] text-muted"
        >
          Digital Marketing
        </p>
      </div>

      <div>
        <div className="mb-4 h-px w-full overflow-hidden bg-line">
          <div
            data-load-bar
            className="h-full w-full origin-left scale-x-0 bg-lime"
          />
        </div>
        <div className="flex items-end justify-between">
          <span
            data-load-meta
            className="font-label text-xs uppercase tracking-[0.25em] text-muted"
          >
            Loading experience
          </span>
          <span
            data-count
            className="font-display text-3xl font-bold tabular-nums text-lime sm:text-4xl"
          >
            000
          </span>
        </div>
      </div>
    </div>
  );
}
