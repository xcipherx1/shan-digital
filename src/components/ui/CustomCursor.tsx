"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useMediaQuery } from "@/lib/useMediaQuery";

/**
 * Custom cursor: a lime dot with a trailing ring. The ring grows over
 * interactive elements and morphs into a labelled disc over elements
 * carrying `data-cursor="view"` (project cards). Only active for
 * fine pointers with motion allowed.
 */
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const fine = useMediaQuery("(pointer: fine)", false);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const enabled = fine && !reduced;

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;

    document.body.classList.add("has-custom-cursor");

    const dotX = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power2.out" });
    const dotY = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power2.out" });
    const ringX = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const INTERACTIVE = "a, button, [role='tab'], input, textarea, summary, [data-cursor]";

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest?.(INTERACTIVE);
      if (!target || !ring.current || !label.current || !dot.current) return;

      const mode = (target as HTMLElement).dataset.cursor;
      if (mode === "view") {
        label.current.textContent = "View";
        gsap.to(ring.current, {
          width: 84,
          height: 84,
          backgroundColor: "rgba(201,247,58,0.95)",
          borderColor: "rgba(201,247,58,0)",
          duration: 0.3,
          ease: "power3.out",
        });
        gsap.to(label.current, { opacity: 1, scale: 1, duration: 0.25 });
        gsap.to(dot.current, { opacity: 0, duration: 0.2 });
      } else {
        gsap.to(ring.current, {
          width: 56,
          height: 56,
          backgroundColor: "rgba(201,247,58,0.08)",
          borderColor: "rgba(201,247,58,0.6)",
          duration: 0.3,
          ease: "power3.out",
        });
      }
    };

    const onOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest?.(INTERACTIVE);
      if (!target || !ring.current || !label.current || !dot.current) return;
      gsap.to(ring.current, {
        width: 36,
        height: 36,
        backgroundColor: "rgba(201,247,58,0)",
        borderColor: "rgba(237,237,230,0.35)",
        duration: 0.3,
        ease: "power3.out",
      });
      gsap.to(label.current, { opacity: 0, scale: 0.5, duration: 0.2 });
      gsap.to(dot.current, { opacity: 1, duration: 0.2 });
    };

    const onDown = () => {
      if (ring.current)
        gsap.to(ring.current, { scale: 0.85, duration: 0.15, ease: "power2.out" });
    };
    const onUp = () => {
      if (ring.current)
        gsap.to(ring.current, { scale: 1, duration: 0.25, ease: "elastic.out(1,0.5)" });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[90]" aria-hidden>
      <div
        ref={ring}
        className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border"
        style={{
          width: 36,
          height: 36,
          borderColor: "rgba(237,237,230,0.35)",
          left: 0,
          top: 0,
        }}
      >
        <span
          ref={label}
          className="font-label text-xs font-semibold uppercase tracking-wider text-coal opacity-0"
          style={{ transform: "scale(0.5)" }}
        >
          View
        </span>
      </div>
      <div
        ref={dot}
        className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime"
        style={{ left: 0, top: 0 }}
      />
    </div>
  );
}
