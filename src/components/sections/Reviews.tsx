"use client";

import { useRef } from "react";
import { Star, BadgeCheck } from "lucide-react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { reviews, hero } from "@/config/site";

function ReviewCard({ review }: { review: (typeof reviews)[number] }) {
  return (
    <figure className="flex w-[19rem] shrink-0 flex-col justify-between rounded-3xl border border-line bg-ink-2 p-6 sm:w-[22rem]">
      <div>
        <span className="flex items-center gap-1" aria-label={`${review.rating} out of 5 stars`}>
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} className="size-3.5 fill-lime text-lime" aria-hidden />
          ))}
        </span>
        <blockquote className="mt-4 text-sm leading-relaxed text-mist">
          &ldquo;{review.text}&rdquo;
        </blockquote>
      </div>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink-3 font-label text-xs font-bold text-lime">
          {review.initials}
        </span>
        <span className="min-w-0">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-mist">
            {review.name}
            <BadgeCheck className="size-3.5 shrink-0 text-teal" aria-hidden />
          </span>
          <span className="block truncate text-xs text-muted">
            {review.business} · {review.date}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export default function Reviews() {
  const root = useRef<HTMLElement>(null);
  const half = Math.ceil(reviews.length / 2);
  const rowA = reviews.slice(0, half);
  const rowB = reviews.slice(half);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-reviews-head]",
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: root.current, start: "top 75%" },
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
      id="reviews"
      className="grain relative scroll-mt-20 overflow-hidden bg-ink py-24 md:py-36"
    >
      <div data-reviews-head className="mx-auto mb-14 flex max-w-7xl flex-col gap-8 px-5 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-4 font-label text-xs font-medium uppercase tracking-[0.25em] text-lime">
            Word of mouth
          </p>
          <h2 className="font-display max-w-2xl text-[clamp(2rem,5vw,3.75rem)] font-extrabold leading-[1.05] tracking-tight text-mist">
            The reviews do{" "}
            <em className="font-serif italic font-normal text-lime">
              the selling.
            </em>
          </h2>
        </div>
        <div className="flex items-center gap-5 rounded-3xl border border-line bg-ink-2 px-6 py-5">
          <span className="font-display text-5xl font-extrabold leading-none text-lime">
            {hero.rating.score}
          </span>
          <span>
            <span className="flex items-center gap-1" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-lime text-lime" />
              ))}
            </span>
            <span className="mt-1 block text-xs text-muted">
              average across {hero.rating.count}
            </span>
          </span>
        </div>
      </div>

      {/* Two opposing auto-scroll rows */}
      <div className="marquee-mask space-y-5">
        <div className="flex w-max gap-5 animate-marquee-slow">
          {[...rowA, ...rowA].map((r, i) => (
            <ReviewCard key={`${r.initials}-${i}`} review={r} />
          ))}
        </div>
        <div
          className="flex w-max gap-5 animate-marquee-slow"
          style={{ animationDirection: "reverse" }}
        >
          {[...rowB, ...rowB].map((r, i) => (
            <ReviewCard key={`${r.initials}-${i}`} review={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
