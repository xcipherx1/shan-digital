"use client";

import { useMemo, useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

type Props = {
  /** Plain text. Wrap words in **double asterisks** to highlight them. */
  text: string;
  className?: string;
  /** Highlight treatment: lime text (dark sections) or marker pen (light). */
  highlight?: "lime" | "marker";
  as?: "p" | "h2" | "h3" | "span";
};

type Token = { word: string; hot: boolean };

function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  // Split on highlight markers first, then words.
  for (const chunk of text.split(/(\*\*[^*]+\*\*)/g)) {
    if (!chunk) continue;
    const hot = chunk.startsWith("**");
    const clean = hot ? chunk.slice(2, -2) : chunk;
    let first = true;
    for (const word of clean.split(/\s+/)) {
      if (!word) {
        first = false;
        continue;
      }
      const prev = tokens[tokens.length - 1];
      // Glue punctuation that trails a highlight ("**word**:") onto the
      // previous token so it never renders as an orphaned chip.
      if (first && prev && /^[^\p{L}\p{N}]+$/u.test(word)) {
        prev.word += word;
      } else {
        tokens.push({ word, hot });
      }
      first = false;
    }
  }
  return tokens;
}

/**
 * Scroll-scrubbed paragraph: words fade from ghosted to full as the
 * reader scrolls, with highlighted words taking the accent colour.
 */
export default function AnimatedText({
  text,
  className = "",
  highlight = "lime",
  as: Tag = "p",
}: Props) {
  const root = useRef<HTMLElement>(null);
  const tokens = useMemo(() => tokenize(text), [text]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          root.current!.querySelectorAll("[data-word]"),
          { opacity: 0.15 },
          {
            opacity: 1,
            stagger: 0.04,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top 82%",
              end: "top 35%",
              scrub: 0.6,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <Tag ref={root as React.RefObject<HTMLParagraphElement>} className={className}>
      {tokens.map((t, i) => (
        <span
          key={i}
          data-word
          className={
            t.hot
              ? highlight === "lime"
                ? "text-lime"
                : "rounded-sm bg-lime/90 box-decoration-clone px-1 text-coal"
              : undefined
          }
        >
          {t.word}
          {i < tokens.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
