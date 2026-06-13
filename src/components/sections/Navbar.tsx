"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { nav, site } from "@/config/site";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useGSAP(() => {
    if (!open || !overlayRef.current) return;
    gsap.fromTo(
      overlayRef.current.querySelectorAll("[data-menu-item]"),
      { y: 48, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.06, duration: 0.5, ease: "power3.out" },
    );
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-line bg-ink/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 md:h-20"
        aria-label="Main navigation"
      >
        <a
          href="#top"
          className="font-display text-lg font-bold tracking-tight text-mist"
        >
          {site.shortName}
          <span className="text-lime">.</span>
          <span className="ml-2 hidden text-[10px] font-medium uppercase tracking-[0.2em] text-muted sm:inline">
            Digital Marketing
          </span>
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-sm text-muted transition-colors duration-200 hover:text-mist"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#lead"
            className="hidden cursor-pointer items-center gap-1.5 rounded-full bg-lime px-5 py-2.5 font-display text-sm font-semibold text-coal transition-colors duration-200 hover:bg-lime-deep sm:inline-flex"
          >
            Get free audit
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-line text-mist lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu className="size-5" aria-hidden />
          </button>
        </div>
      </nav>

      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex h-dvh flex-col bg-ink"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="flex h-16 items-center justify-between px-5 sm:px-8 md:h-20">
            <span className="font-display text-lg font-bold text-mist">
              {site.shortName}
              <span className="text-lime">.</span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-line text-mist"
              aria-label="Close menu"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <nav
            className="flex flex-1 flex-col justify-center gap-2 px-6 sm:px-10"
            aria-label="Mobile navigation"
          >
            {nav.map((item, i) => (
              <a
                key={item.href}
                data-menu-item
                href={item.href}
                onClick={() => setOpen(false)}
                className="group flex items-baseline gap-4 border-b border-line py-4"
              >
                <span className="font-display text-sm text-lime">
                  0{i + 1}
                </span>
                <span className="font-display text-4xl font-semibold text-mist transition-colors duration-200 group-hover:text-lime sm:text-5xl">
                  {item.label}
                </span>
              </a>
            ))}
            <a
              data-menu-item
              href="#lead"
              onClick={() => setOpen(false)}
              className="mt-8 inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-lime px-7 py-4 font-display text-base font-semibold text-coal"
            >
              Get your free audit
              <ArrowUpRight className="size-5" aria-hidden />
            </a>
          </nav>
          <p data-menu-item className="px-6 pb-8 text-sm text-muted sm:px-10">
            {site.address.city}, {site.address.country} · {site.email}
          </p>
        </div>
      )}
    </header>
  );
}
