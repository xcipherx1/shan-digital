"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

/**
 * Mobile-only sticky CTA bar. Hides while the questionnaire itself is
 * on screen so it never covers the form it points to.
 */
export default function StickyCTA() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById("plan");
    if (!target || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 p-3 backdrop-blur transition-transform duration-300 md:hidden ${
        hidden ? "translate-y-full" : "translate-y-0"
      }`}
    >
      <a
        href="#plan"
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-lime px-6 py-3.5 font-display text-base font-bold text-coal"
      >
        Book my free call
        <ArrowRight className="size-5" aria-hidden />
      </a>
    </div>
  );
}
