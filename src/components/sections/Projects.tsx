"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, Crosshair } from "lucide-react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { projects, services, type Project, type ServiceKey } from "@/config/site";

type Filter = "all" | ServiceKey;

function ProjectCover({ project }: { project: Project }) {
  const { palette } = project;
  return (
    <div
      className="relative aspect-[5/4] overflow-hidden rounded-2xl sm:aspect-[16/10]"
      style={{
        background: `linear-gradient(135deg, ${palette.from}, ${palette.to})`,
      }}
      aria-hidden
    >
      {/* Decorative topo rings */}
      <svg
        className="absolute -right-16 -top-16 size-72 opacity-25"
        viewBox="0 0 200 200"
        fill="none"
      >
        {[28, 52, 76, 100].map((r) => (
          <circle key={r} cx="100" cy="100" r={r} stroke="white" strokeWidth="1" />
        ))}
      </svg>

      {/* Mock browser chrome */}
      <div className="absolute inset-x-4 bottom-0 top-9 rounded-t-xl border border-white/15 bg-ink/80 transition-transform duration-500 ease-out group-hover:-translate-y-2 sm:inset-x-10 sm:top-10">
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2.5">
          <span className="flex gap-1.5">
            <span className="size-2 rounded-full bg-white/25" />
            <span className="size-2 rounded-full bg-white/25" />
            <span className="size-2 rounded-full" style={{ background: palette.accent }} />
          </span>
          <span className="truncate rounded-md bg-white/10 px-2.5 py-0.5 font-label text-[10px] tracking-wide text-white/60">
            {project.client.toLowerCase().replace(/[^a-z]+/g, "")}.co.uk
          </span>
        </div>
        <div className="flex h-full flex-col justify-center px-5 pb-9 sm:px-6">
          <span className="font-label text-[10px] uppercase tracking-[0.3em] text-white/50">
            {project.serviceLabel}
          </span>
          <span className="font-display mt-2 text-[clamp(1.3rem,5vw,2.2rem)] font-extrabold leading-[1.05] tracking-tight text-white">
            {project.client}
          </span>
          <span className="mt-3 flex flex-wrap gap-2">
            {project.results.map((r) => (
              <span
                key={r.label}
                className="rounded-full px-2.5 py-1 font-label text-[10px] font-bold text-coal"
                style={{ background: palette.accent }}
              >
                {r.value} {r.label}
              </span>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const visible = projects.filter((p) => filter === "all" || p.service === filter);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-work-head]",
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: root.current, start: "top 75%" },
          },
        );
        gsap.fromTo(
          "[data-project]",
          { y: 64, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: grid.current, start: "top 78%" },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  function applyFilter(next: Filter) {
    if (next === filter || !grid.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setFilter(next);
      return;
    }
    gsap.to(grid.current, {
      opacity: 0,
      y: 16,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        setFilter(next);
        gsap.fromTo(
          grid.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
        );
      },
    });
  }

  return (
    <section
      ref={root}
      id="work"
      className="grain relative scroll-mt-20 bg-ink px-5 py-24 sm:px-8 md:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <div data-work-head className="mb-12 md:mb-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 font-label text-xs font-medium uppercase tracking-[0.25em] text-lime">
                Selected work
              </p>
              <h2 className="font-display max-w-2xl text-[clamp(2rem,5vw,3.75rem)] font-extrabold leading-[1.05] tracking-tight text-mist">
                Proof you can{" "}
                <em className="font-serif italic font-normal text-lime">click through.</em>
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted md:text-base">
              Every project below is a system, not a one-off. Hover for the
              details designers argue about.
            </p>
          </div>

          {/* Filters */}
          <div className="mt-9 flex flex-wrap gap-2" role="group" aria-label="Filter projects by service">
            {(
              [
                { key: "all" as const, label: "All work" },
                ...services.map((s) => ({ key: s.key, label: s.title })),
              ]
            ).map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => applyFilter(f.key)}
                aria-pressed={filter === f.key}
                className={`cursor-pointer rounded-full border px-4 py-2 font-label text-xs font-medium uppercase tracking-wider transition-colors duration-200 ${
                  filter === f.key
                    ? "border-lime bg-lime text-coal"
                    : "border-line text-muted hover:border-lime/50 hover:text-mist"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div ref={grid} className="grid gap-6 md:grid-cols-2">
          {visible.map((project) => (
            <article
              key={project.slug}
              data-project
              data-cursor="view"
              tabIndex={0}
              className="group rounded-3xl border border-line bg-ink-2 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-lime/40 sm:p-5"
            >
              <ProjectCover project={project} />

              <div className="px-2 pb-2 pt-5 sm:px-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl font-bold tracking-tight text-mist sm:text-2xl">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted">
                      {project.client} · {project.serviceLabel} · {project.year}
                    </p>
                  </div>
                  <span className="mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-all duration-300 group-hover:border-lime group-hover:bg-lime group-hover:text-coal">
                    <ArrowUpRight className="size-4" aria-hidden />
                  </span>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {project.summary}
                </p>

                {/* Designer's notes — revealed on hover/focus, always open on touch */}
                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr] max-md:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <div className="mt-5 rounded-2xl border border-line bg-ink p-5">
                      <p className="mb-3 flex items-center gap-2 font-label text-[10px] font-medium uppercase tracking-[0.25em] text-lime">
                        <Crosshair className="size-3.5" aria-hidden />
                        The details that did the work
                      </p>
                      <ul className="space-y-2">
                        {project.critique.map((note) => (
                          <li key={note} className="flex items-start gap-2.5 text-xs leading-relaxed text-muted sm:text-sm">
                            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-lime" aria-hidden />
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
