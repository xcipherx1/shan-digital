"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CalendarCheck,
  LoaderCircle,
  PhoneCall,
} from "lucide-react";
import { funnel, questions, type OfferKey } from "@/config/landing";

type Stage = "questions" | "contact" | "booking" | "done";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function track(event: string, custom = false) {
  try {
    if (typeof window.fbq === "function") {
      window.fbq(custom ? "trackCustom" : "track", event);
    }
  } catch {
    /* pixel is optional */
  }
}

/** UTM + fbclid attribution read once from the landing URL. */
function readAttribution(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  const map: Record<string, string> = {
    utm_source: "utmSource",
    utm_medium: "utmMedium",
    utm_campaign: "utmCampaign",
    utm_content: "utmContent",
    utm_term: "utmTerm",
    fbclid: "fbclid",
  };
  for (const [param, key] of Object.entries(map)) {
    const v = params.get(param);
    if (v) out[key] = v.slice(0, 400);
  }
  return out;
}

const inputCls =
  "w-full rounded-xl border border-line bg-ink px-4 py-3.5 text-base text-mist placeholder:text-muted/50 focus:border-lime focus:outline-none";

export default function Questionnaire() {
  const [stage, setStage] = useState<Stage>("questions");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOffer, setSelectedOffer] = useState<OfferKey | undefined>();
  const [textDraft, setTextDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [leadId, setLeadId] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const attribution = useRef<Record<string, string>>({});

  useEffect(() => {
    attribution.current = readAttribution();
  }, []);

  const q = questions[step];
  const totalSteps = questions.length + 1; // +1 contact stage
  const progress =
    stage === "questions"
      ? step / totalSteps
      : stage === "contact"
        ? questions.length / totalSteps
        : 1;

  const answerOption = useCallback(
    (option: string, index: number) => {
      const current = questions[step];
      setAnswers((a) => ({ ...a, [current.id]: option }));
      if ("offerKeys" in current && current.offerKeys) {
        setSelectedOffer(current.offerKeys[index]);
      }
      if (step + 1 < questions.length) {
        setStep(step + 1);
        setTextDraft("");
      } else {
        setStage("contact");
      }
    },
    [step],
  );

  const answerText = useCallback(() => {
    const value = textDraft.trim();
    if (!value) return;
    const current = questions[step];
    setAnswers((a) => ({ ...a, [current.id]: value }));
    if (step + 1 < questions.length) {
      setStep(step + 1);
      setTextDraft("");
    } else {
      setStage("contact");
    }
  }, [step, textDraft]);

  const goBack = useCallback(() => {
    setErrorMsg("");
    if (stage === "contact") {
      setStage("questions");
      setStep(questions.length - 1);
    } else if (step > 0) {
      setStep(step - 1);
      setTextDraft("");
    }
  }, [stage, step]);

  async function submitContact(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");
    setFieldErrors({});

    const form = new FormData(e.currentTarget);
    const payload = {
      fullName: String(form.get("fullName") ?? "").trim(),
      businessName: String(form.get("businessName") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      city: answers.location ?? "",
      selectedOffer,
      painPoint: answers.pain_point,
      answers,
      website: String(form.get("website") ?? ""), // honeypot
      ...attribution.current,
    };

    const errors: Record<string, string> = {};
    if (payload.fullName.length < 2) errors.fullName = "Please enter your name";
    if (payload.businessName.length < 2)
      errors.businessName = "Please enter your business name";
    if (!/^\S+@\S+\.\S+$/.test(payload.email))
      errors.email = "Please enter a valid email";
    if (payload.phone.length < 7) errors.phone = "Please enter a phone number";
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
      if (!res.ok || !json.id) {
        setErrorMsg(
          json.message ??
            `Something went wrong. Email us at ${funnel.email} and we'll sort your plan directly.`,
        );
        return;
      }
      setLeadId(json.id);
      track("Lead");
      setStage("booking");
    } catch {
      setErrorMsg(
        `We couldn't reach the server. Email us at ${funnel.email} and we'll sort your plan directly.`,
      );
    } finally {
      setSaving(false);
    }
  }

  const confirmBooking = useCallback(
    async (ref: string) => {
      if (!leadId || bookingConfirmed) return;
      setBookingConfirmed(true);
      try {
        await fetch(`/api/leads/${encodeURIComponent(leadId)}/booking`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ meetingRef: ref }),
        });
        track("BookingComplete", true);
      } catch {
        /* lead is already saved; booking confirmation is best-effort */
      }
      setStage("done");
    },
    [leadId, bookingConfirmed],
  );

  // Cal.com embed fires postMessage events; detect a successful booking.
  useEffect(() => {
    if (stage !== "booking" || !funnel.bookingUrl) return;
    const onMessage = (e: MessageEvent) => {
      if (!e.origin.includes("cal.com") && !e.origin.includes("calendly.com"))
        return;
      const raw = typeof e.data === "string" ? e.data : JSON.stringify(e.data ?? "");
      if (/bookingSuccessful|calendly\.event_scheduled/i.test(raw)) {
        confirmBooking("embedded-booking");
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [stage, confirmBooking]);

  /* ── Render ── */

  if (stage === "done") {
    return (
      <div className="rounded-3xl border border-line bg-ink-2 p-8 text-center sm:p-10">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-lime text-coal">
          <Check className="size-7" aria-hidden />
        </span>
        <h3 className="font-display mt-5 text-2xl font-extrabold tracking-tight text-mist">
          You&apos;re all set.
        </h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
          {bookingConfirmed && funnel.bookingUrl
            ? "Your call is booked and a confirmation email is on its way. We'll see you then."
            : "We've got your details and we'll ring you within one working day to sort your free website plan."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-line bg-ink-2 p-5 sm:p-8">
      {/* Progress */}
      <div className="mb-6 flex items-center gap-3">
        {(stage !== "questions" || step > 0) && stage !== "booking" && (
          <button
            type="button"
            onClick={goBack}
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-lime hover:text-lime"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" aria-hidden />
          </button>
        )}
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-ink"
          role="progressbar"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Questionnaire progress"
        >
          <div
            className="h-full rounded-full bg-lime transition-[width] duration-300"
            style={{ width: `${Math.max(6, progress * 100)}%` }}
          />
        </div>
      </div>

      {stage === "questions" && (
        <div>
          <p className="font-label text-[11px] uppercase tracking-[0.2em] text-lime">
            Question {step + 1} of {questions.length}
          </p>
          <h3 className="font-display mt-2 text-xl font-extrabold tracking-tight text-mist sm:text-2xl">
            {q.label}
          </h3>

          {"options" in q && q.options ? (
            <div className="mt-5 grid gap-2.5">
              {q.options.map((option, i) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => answerOption(option, i)}
                  className={`cursor-pointer rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-colors duration-150 sm:text-base ${
                    answers[q.id] === option
                      ? "border-lime bg-lime/10 text-lime"
                      : "border-line bg-ink text-mist hover:border-lime/50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-5">
              <label htmlFor={`q-${q.id}`} className="sr-only">
                {q.label}
              </label>
              <input
                id={`q-${q.id}`}
                value={textDraft}
                onChange={(e) => setTextDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && answerText()}
                placeholder={"placeholder" in q ? q.placeholder : ""}
                className={inputCls}
                maxLength={120}
                autoComplete="address-level2"
              />
              <button
                type="button"
                onClick={answerText}
                disabled={!textDraft.trim()}
                className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-lime px-6 py-3.5 font-display text-sm font-bold text-coal transition-colors hover:bg-lime-deep disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
              >
                Next
                <ArrowRight className="size-4" aria-hidden />
              </button>
            </div>
          )}
        </div>
      )}

      {stage === "contact" && (
        <form onSubmit={submitContact} noValidate>
          <p className="font-label text-[11px] uppercase tracking-[0.2em] text-lime">
            Last step
          </p>
          <h3 className="font-display mt-2 text-xl font-extrabold tracking-tight text-mist sm:text-2xl">
            Where do we send your free website plan?
          </h3>

          {/* Honeypot — hidden from humans */}
          <div className="absolute left-[-9999px]" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {(
              [
                { name: "fullName", label: "Full name", type: "text", auto: "name", ph: "Jamie Smith" },
                { name: "businessName", label: "Business name", type: "text", auto: "organization", ph: "Smith Roofing Ltd" },
                { name: "email", label: "Email", type: "email", auto: "email", ph: "jamie@smithroofing.co.uk" },
                { name: "phone", label: "Phone", type: "tel", auto: "tel", ph: "07000 000000" },
              ] as const
            ).map((f) => (
              <div key={f.name}>
                <label
                  htmlFor={f.name}
                  className="mb-1.5 block font-label text-[11px] uppercase tracking-wider text-muted"
                >
                  {f.label}
                </label>
                <input
                  id={f.name}
                  name={f.name}
                  type={f.type}
                  autoComplete={f.auto}
                  placeholder={f.ph}
                  required
                  className={inputCls}
                />
                {fieldErrors[f.name] && (
                  <p role="alert" className="mt-1 text-xs text-red-300">
                    {fieldErrors[f.name]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {errorMsg && (
            <p role="alert" className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-sm text-red-300">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-lime px-8 py-4 font-display text-base font-bold text-coal transition-colors hover:bg-lime-deep disabled:opacity-60"
          >
            {saving ? (
              <>
                <LoaderCircle className="size-5 animate-spin" aria-hidden />
                Saving…
              </>
            ) : (
              <>
                Get my free plan & book my call
                <ArrowRight className="size-5" aria-hidden />
              </>
            )}
          </button>
          <p className="mt-3 text-center text-xs text-muted">
            No spam. No hard sell. Just a plan for your roofing business.
          </p>
        </form>
      )}

      {stage === "booking" && (
        <div>
          <p className="font-label text-[11px] uppercase tracking-[0.2em] text-lime">
            Plan saved — one more thing
          </p>
          <h3 className="font-display mt-2 text-xl font-extrabold tracking-tight text-mist sm:text-2xl">
            Book your free 15-minute call
          </h3>

          {funnel.bookingUrl ? (
            <>
              <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-ink">
                <iframe
                  src={funnel.bookingUrl}
                  title="Book your strategy call"
                  className="h-[560px] w-full"
                  loading="lazy"
                />
              </div>
              <button
                type="button"
                onClick={() => confirmBooking("manual-confirm")}
                className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-lime px-6 py-3.5 font-display text-sm font-bold text-lime transition-colors hover:bg-lime hover:text-coal"
              >
                <CalendarCheck className="size-4" aria-hidden />
                I&apos;ve booked my slot
              </button>
            </>
          ) : (
            <>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Your details are saved. Tap below and we&apos;ll ring you within
                one working day to walk through your plan — or we&apos;ll just
                call you anyway. Either way, you&apos;re covered.
              </p>
              <button
                type="button"
                onClick={() => confirmBooking("callback-requested")}
                className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-lime px-8 py-4 font-display text-base font-bold text-coal transition-colors hover:bg-lime-deep"
              >
                <PhoneCall className="size-5" aria-hidden />
                Request my call
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
