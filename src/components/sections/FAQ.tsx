"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { faqs } from "@/config/site";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="grain relative scroll-mt-20 bg-ink px-5 py-24 sm:px-8 md:py-36"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-lime">
            FAQ
          </p>
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-mist">
            Straight answers,{" "}
            <em className="font-serif italic font-normal text-lime">
              before you ask.
            </em>
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted md:text-base">
            Anything else? Email us at{" "}
            <a
              href="mailto:info@shandigitalmarketing.com"
              className="text-mist underline decoration-lime underline-offset-4 transition-colors duration-200 hover:text-lime"
            >
              info@shandigitalmarketing.com
            </a>{" "}
            and a human replies within one working day.
          </p>
        </div>

        <ul>
          {faqs.map((faq, i) => {
            const open = openIndex === i;
            return (
              <li key={faq.q} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  aria-controls={`faq-panel-${i}`}
                  className="flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="font-display text-base font-semibold text-mist sm:text-lg">
                    {faq.q}
                  </span>
                  <Plus
                    className={`size-5 shrink-0 text-lime transition-transform duration-300 ${
                      open ? "rotate-45" : ""
                    }`}
                    aria-hidden
                  />
                </button>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-6 text-sm leading-relaxed text-muted sm:text-base">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
