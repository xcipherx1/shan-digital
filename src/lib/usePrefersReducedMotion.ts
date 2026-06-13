"use client";

import { useMediaQuery } from "@/lib/useMediaQuery";

/**
 * True when the user prefers reduced motion. Defaults to true on the
 * server so heavy visuals (WebGL) never render before we know.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)", true);
}
