"use client";

import { useRef, useCallback } from "react";
import { gsap } from "@/lib/gsap";

type Props = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
};

/** Button/link that gently leans toward the cursor (desktop only). */
export default function MagneticButton({
  children,
  className = "",
  href,
  onClick,
  type = "button",
  disabled,
  ariaLabel,
}: Props) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, { x: x * 0.25, y: y * 0.35, duration: 0.4, ease: "power3.out" });
  }, []);

  const onLeave = useCallback(() => {
    if (ref.current)
      gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
  }, []);

  const cls = `inline-flex cursor-pointer items-center justify-center gap-2 transition-colors duration-200 ${className}`;

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={cls}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${cls} disabled:cursor-not-allowed disabled:opacity-60`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
