"use client";

import { useRef, useState } from "react";
import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  LoaderCircle,
  Search,
} from "lucide-react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { auditLeadSchema, callLeadSchema } from "@/lib/validation";
import { site } from "@/config/site";

type Tab = "audit" | "call";
type Status = "idle" | "loading" | "success" | "error";

const inputCls =
  "w-full rounded-xl border border-line bg-ink px-4 py-3.5 text-sm text-mist placeholder:text-muted/60 transition-colors duration-200 focus:border-lime focus:outline-none";

function Field({
  label,
  name,
  error,
  ...rest
}: {
  label: string;
  name: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted"
      >
        {label}
      </label>
      <input id={name} name={name} className={inputCls} {...rest} />
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export default function LeadMagnet() {
  const root = useRef<HTMLElement>(null);
  const [tab, setTab] = useState<Tab>("audit");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverMessage, setServerMessage] = useState("");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-lead-panel]",
          { y: 64, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: root.current, start: "top 70%" },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  function switchTab(next: Tab) {
    setTab(next);
    setStatus("idle");
    setErrors({});
    setServerMessage("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setServerMessage("");

    const raw = Object.fromEntries(new FormData(e.currentTarget).entries());
    const schema = tab === "audit" ? auditLeadSchema : callLeadSchema;
    const parsed = schema.safeParse({ ...raw, type: tab });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = (await res.json()) as { message?: string };
      if (!res.ok) {
        setServerMessage(
          json.message ??
            `Something went wrong. Please email us directly at ${site.email}.`,
        );
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setServerMessage(
        `We couldn't reach the server. Please email us directly at ${site.email}.`,
      );
      setStatus("error");
    }
  }

  return (
    <section
      ref={root}
      id="lead"
      className="grain relative scroll-mt-20 overflow-hidden bg-ink px-5 py-24 sm:px-8 md:py-36"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(201,247,58,0.14), transparent 65%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-lime">
          Free. No strings, no spam
        </p>
        <h2 className="font-display text-[clamp(2rem,5.5vw,4rem)] font-bold leading-[1.03] tracking-tight text-mist">
          See exactly what your market{" "}
          <em className="font-serif italic font-normal text-lime">
            is hiding from you.
          </em>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          Get a human-built local SEO audit of your business, or book a
          15-minute strategy call. Either way, you&apos;ll leave knowing what to
          fix first.
        </p>

        <div
          data-lead-panel
          className="mt-12 rounded-3xl border border-line bg-ink-2/90 p-6 text-left backdrop-blur sm:p-10"
        >
          <div
            role="tablist"
            aria-label="Choose your free offer"
            className="mb-8 grid grid-cols-1 gap-2 rounded-2xl border border-line bg-ink p-1.5 sm:grid-cols-2"
          >
            {(
              [
                { key: "audit", label: "Free Local SEO Audit", Icon: Search },
                { key: "call", label: "Book a Strategy Call", Icon: CalendarClock },
              ] as const
            ).map(({ key, label, Icon }) => (
              <button
                key={key}
                role="tab"
                type="button"
                aria-selected={tab === key}
                onClick={() => switchTab(key)}
                className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 font-display text-sm font-semibold transition-colors duration-200 ${
                  tab === key
                    ? "bg-lime text-coal"
                    : "text-muted hover:text-mist"
                }`}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </button>
            ))}
          </div>

          {status === "success" ? (
            <div className="flex flex-col items-center py-10 text-center">
              <CheckCircle2 className="size-12 text-lime" aria-hidden />
              <h3 className="font-display mt-5 text-2xl font-semibold text-mist">
                {tab === "audit" ? "Audit on its way." : "Call request received."}
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
                {tab === "audit"
                  ? "Check your inbox. We've confirmed your request and a human will deliver your audit within 2 working days."
                  : "Check your inbox. We've confirmed your request and we'll be in touch within one working day to lock in a time."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {/* Honeypot — hidden from humans, irresistible to bots */}
              <div className="absolute left-[-9999px]" aria-hidden="true">
                <label htmlFor="company">Company</label>
                <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              {tab === "audit" ? (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Your name" name="name" placeholder="Jane Smith" autoComplete="name" error={errors.name} />
                  <Field label="Email" name="email" type="email" placeholder="jane@business.co.uk" autoComplete="email" error={errors.email} />
                  <Field label="Business name" name="business" placeholder="Smith & Sons Roofing" autoComplete="organization" error={errors.business} />
                  <Field label="Area you serve" name="location" placeholder="Bristol & Bath" error={errors.location} />
                  <div className="sm:col-span-2">
                    <Field label="Website (optional)" name="website" type="url" placeholder="https://yourbusiness.co.uk" autoComplete="url" error={errors.website} />
                  </div>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Your name" name="name" placeholder="Jane Smith" autoComplete="name" error={errors.name} />
                  <Field label="Email" name="email" type="email" placeholder="jane@business.co.uk" autoComplete="email" error={errors.email} />
                  <Field label="Phone" name="phone" type="tel" placeholder="07000 000000" autoComplete="tel" error={errors.phone} />
                  <div className="sm:col-span-2 sm:row-start-2 sm:col-start-1">
                    <label
                      htmlFor="goal"
                      className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted"
                    >
                      What do you want to achieve?
                    </label>
                    <textarea
                      id="goal"
                      name="goal"
                      rows={4}
                      placeholder="More enquiries, a new website, ranking in the map pack…"
                      className={`${inputCls} resize-none`}
                    />
                    {errors.goal && (
                      <p role="alert" className="mt-1.5 text-xs text-red-400">
                        {errors.goal}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {status === "error" && (
                <p role="alert" className="mt-5 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                  {serverMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-8 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-lime px-8 py-4 font-display text-base font-semibold text-coal transition-colors duration-200 hover:bg-lime-deep disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {status === "loading" ? (
                  <>
                    <LoaderCircle className="size-5 animate-spin" aria-hidden />
                    Sending…
                  </>
                ) : (
                  <>
                    {tab === "audit" ? "Claim my free audit" : "Request my call"}
                    <ArrowUpRight className="size-5" aria-hidden />
                  </>
                )}
              </button>
              <p className="mt-4 text-xs leading-relaxed text-muted">
                We&apos;ll only use your details to deliver your{" "}
                {tab === "audit" ? "audit" : "call"}, never for spam, never
                sold. Unsubscribe any time.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
