"use client";

import { useMemo, useRef } from "react";
import { TrendingUp } from "lucide-react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { caseStudies, growthCurve, stats } from "@/config/site";

const W = 560;
const H = 280;
const PAD = 28;

function buildPaths() {
  const xs = growthCurve.map(
    (_, i) => PAD + (i / (growthCurve.length - 1)) * (W - PAD * 2),
  );
  const min = Math.min(...growthCurve.map((d) => d.value));
  const max = Math.max(...growthCurve.map((d) => d.value));
  const ys = growthCurve.map(
    (d) => H - PAD - ((d.value - min) / (max - min)) * (H - PAD * 2),
  );
  const line = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  const area = `${line} L${xs[xs.length - 1]},${H - PAD} L${xs[0]},${H - PAD} Z`;
  return { line, area, xs, ys };
}

export default function Results() {
  const root = useRef<HTMLElement>(null);
  const { line, area, xs, ys } = useMemo(() => buildPaths(), []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Draw the growth line as it scrolls into view
        const path = root.current?.querySelector<SVGPathElement>("[data-chart-line]");
        if (path) {
          const len = path.getTotalLength();
          gsap.fromTo(
            path,
            { strokeDasharray: len, strokeDashoffset: len },
            {
              strokeDashoffset: 0,
              ease: "none",
              scrollTrigger: {
                trigger: "[data-chart]",
                start: "top 75%",
                end: "top 30%",
                scrub: 0.5,
              },
            },
          );
        }
        gsap.fromTo(
          "[data-chart-area]",
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.8,
            scrollTrigger: { trigger: "[data-chart]", start: "top 45%" },
          },
        );
        gsap.fromTo(
          "[data-chart-dot]",
          { scale: 0, transformOrigin: "center" },
          {
            scale: 1,
            stagger: 0.07,
            duration: 0.4,
            ease: "back.out(2)",
            scrollTrigger: { trigger: "[data-chart]", start: "top 45%" },
          },
        );

        // Count-up stats
        gsap.utils.toArray<HTMLElement>("[data-counter]").forEach((el) => {
          const value = parseFloat(el.dataset.value ?? "0");
          const decimals = parseInt(el.dataset.decimals ?? "0", 10);
          const obj = { n: 0 };
          gsap.to(obj, {
            n: value,
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
            onUpdate: () => {
              el.textContent = obj.n.toFixed(decimals);
            },
          });
        });

        gsap.fromTo(
          "[data-result-card]",
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: "[data-result-cards]", start: "top 80%" },
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
      id="results"
      className="grain relative scroll-mt-20 bg-ink px-5 py-24 sm:px-8 md:py-36"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 15% 0%, rgba(45,212,191,0.08), transparent 60%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl">
        <p className="mb-4 font-label text-xs font-medium uppercase tracking-[0.25em] text-lime">
          Proof, not promises
        </p>
        <h2 className="font-display max-w-2xl text-[clamp(2rem,5vw,3.75rem)] font-extrabold leading-[1.05] tracking-tight text-mist">
          Systems that{" "}
          <em className="font-serif italic font-normal text-lime">
            pay for themselves.
          </em>
        </h2>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-10">
          {/* Growth chart */}
          <div data-chart className="rounded-3xl border border-line bg-ink-2 p-6 sm:p-8">
            <div className="mb-5 flex items-center justify-between">
              <p className="font-label text-xs font-medium uppercase tracking-[0.22em] text-muted">
                Avg. client enquiry index, first 8 months
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-lime/10 px-3 py-1 font-label text-[11px] font-bold text-lime">
                <TrendingUp className="size-3.5" aria-hidden />
                +212%
              </span>
            </div>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full"
              role="img"
              aria-label="Line chart showing average client enquiries growing from index 100 to 312 over eight months"
            >
              <defs>
                <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c9f73a" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#c9f73a" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0.25, 0.5, 0.75].map((f) => (
                <line
                  key={f}
                  x1={PAD}
                  x2={W - PAD}
                  y1={PAD + f * (H - PAD * 2)}
                  y2={PAD + f * (H - PAD * 2)}
                  stroke="rgba(237,237,230,0.07)"
                />
              ))}
              <path data-chart-area d={area} fill="url(#chartFill)" />
              <path
                data-chart-line
                d={line}
                fill="none"
                stroke="#c9f73a"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {xs.map((x, i) => (
                <g key={i}>
                  <circle data-chart-dot cx={x} cy={ys[i]} r="4" fill="#0a0b10" stroke="#c9f73a" strokeWidth="2" />
                  <text
                    x={x}
                    y={H - 6}
                    textAnchor="middle"
                    className="fill-muted font-label"
                    fontSize="10"
                  >
                    {growthCurve[i].month}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Counters */}
          <dl className="grid grid-cols-2 content-center gap-x-6 gap-y-10 rounded-3xl border border-line bg-ink-2 p-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dd className="font-display text-[clamp(2rem,3.6vw,3.2rem)] font-extrabold leading-none tracking-tight text-mist">
                  <span
                    data-counter
                    data-value={stat.value}
                    data-decimals={"decimals" in stat ? stat.decimals : 0}
                  >
                    {stat.value}
                  </span>
                  <span className="text-lime">{stat.suffix}</span>
                </dd>
                <dt className="mt-2.5 text-xs leading-snug text-muted sm:text-sm">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>

        {/* Case study strip */}
        <div data-result-cards className="mt-6 grid gap-5 md:grid-cols-3">
          {caseStudies.map((cs) => (
            <article
              key={cs.sector}
              data-result-card
              className="group flex flex-col rounded-3xl border border-line bg-ink-2 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-teal/40"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="rounded-full border border-line px-3.5 py-1.5 text-xs text-muted">
                  {cs.sector}
                </span>
                <span className="font-label text-[10px] uppercase tracking-wider text-muted">
                  {cs.location}
                </span>
              </div>
              <p className="font-display text-4xl font-extrabold leading-none text-lime">
                {cs.result}
              </p>
              <p className="mt-2 text-sm font-medium text-mist">{cs.metric}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted">{cs.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
