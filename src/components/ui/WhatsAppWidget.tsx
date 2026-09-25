"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { site } from "@/config/site";

const WA_NUMBER = site.phoneHref.replace(/[^0-9]/g, "");
const DEFAULT_MESSAGE =
  "Hi Shan Digital, I'd like to talk about getting more leads for my business.";

function waUrl(message: string): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Floating WhatsApp chat launcher, bottom-left. Opens a small panel so
 * the visitor can pre-write their message, then hands off to WhatsApp
 * (web or the installed app) in a new tab.
 */
export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [heroInView, setHeroInView] = useState(false);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  /**
   * The hero carries its own WhatsApp link, so the floating bubble stays
   * out of the way while the hero is on screen. That avoids duplicating
   * the same action and stops it covering the proof stats on mobile.
   * On pages with no hero (`#top`), the bubble is always available.
   */
  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { rootMargin: "-45% 0px 0px 0px" },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  // Close on Escape or an outside click.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    inputRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  function send() {
    window.open(waUrl(message.trim() || DEFAULT_MESSAGE), "_blank", "noopener");
    setOpen(false);
  }

  return (
    <div
      ref={panelRef}
      className={`fixed bottom-5 left-5 z-40 transition-all duration-300 print:hidden ${
        heroInView && !open
          ? "pointer-events-none translate-y-4 opacity-0"
          : "translate-y-0 opacity-100"
      }`}
    >
      {open && (
        <div
          role="dialog"
          aria-label="Chat on WhatsApp"
          className="mb-3 w-[min(20rem,calc(100vw-2.5rem))] overflow-hidden rounded-3xl border border-line bg-ink-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75)]"
        >
          <div className="flex items-center justify-between gap-3 bg-[#25D366] px-4 py-3">
            <span className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-full bg-white/20">
                <MessageCircle className="size-4 text-white" aria-hidden />
              </span>
              <span>
                <span className="block font-display text-sm font-bold text-white">
                  {site.shortName} Digital
                </span>
                <span className="block text-[11px] text-white/80">
                  Typically replies in minutes
                </span>
              </span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close WhatsApp chat"
              className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/20"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>

          <div className="p-4">
            <p className="rounded-2xl rounded-tl-sm bg-ink px-3.5 py-2.5 text-sm leading-relaxed text-muted">
              Hi there. Tell us what you need and we&apos;ll come back with a
              straight answer, no hard sell.
            </p>

            <label htmlFor="wa-message" className="sr-only">
              Your WhatsApp message
            </label>
            <textarea
              ref={inputRef}
              id="wa-message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              className="mt-3 w-full resize-none rounded-xl border border-line bg-ink px-3.5 py-2.5 text-sm text-mist placeholder:text-muted/60 focus:border-[#25D366] focus:outline-none"
              placeholder="Type your message…"
            />

            <button
              type="button"
              onClick={send}
              className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 font-display text-sm font-bold text-[#04310f] transition-colors hover:bg-[#1eb955]"
            >
              <Send className="size-4" aria-hidden />
              Start WhatsApp chat
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close WhatsApp chat" : "Chat with us on WhatsApp"}
        className="group flex size-14 cursor-pointer items-center justify-center rounded-full bg-[#25D366] shadow-[0_10px_30px_-6px_rgba(37,211,102,0.6)] transition-transform duration-200 hover:scale-105 active:scale-95"
      >
        {open ? (
          <X className="size-6 text-white" aria-hidden />
        ) : (
          <MessageCircle className="size-7 text-white" aria-hidden />
        )}
        {!open && (
          <span
            className="absolute inline-flex size-14 animate-ping rounded-full bg-[#25D366] opacity-20"
            aria-hidden
          />
        )}
      </button>
    </div>
  );
}
