"use client";

import { useEffect, useRef } from "react";
import { signOut } from "next-auth/react";

const IDLE_MS = 60 * 60 * 1000; // 1 hour
const STORAGE_KEY = "dialer:lastActivity";

/**
 * Signs the agent out after an hour without interaction. Pointer,
 * keyboard, touch and scroll all count as activity, as does an ongoing
 * call (the Dialer emits "dialer:activity" while connected, so nobody
 * gets logged out mid-conversation). The timestamp lives in
 * localStorage so a laptop waking from sleep past the deadline is
 * signed out immediately rather than getting a fresh hour.
 */
export default function IdleLogout() {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let expired = false;
    const expire = () => {
      if (expired) return;
      expired = true;
      localStorage.removeItem(STORAGE_KEY);
      signOut({ callbackUrl: "/dialer/login?timeout=1" });
    };

    const arm = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(expire, IDLE_MS);
    };

    const touch = () => {
      if (expired) return;
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
      arm();
    };

    // Tab reopened / machine woken after the deadline → out immediately.
    const last = Number(localStorage.getItem(STORAGE_KEY) ?? Date.now());
    if (Date.now() - last > IDLE_MS) {
      expire();
      return;
    }

    const events = ["pointerdown", "keydown", "touchstart", "wheel"] as const;
    events.forEach((e) => window.addEventListener(e, touch, { passive: true }));
    window.addEventListener("dialer:activity", touch);

    const onVisibility = () => {
      if (document.visibilityState !== "visible") return;
      const ts = Number(localStorage.getItem(STORAGE_KEY) ?? Date.now());
      if (Date.now() - ts > IDLE_MS) expire();
      else arm();
    };
    document.addEventListener("visibilitychange", onVisibility);

    touch();

    return () => {
      if (timer.current) clearTimeout(timer.current);
      events.forEach((e) => window.removeEventListener(e, touch));
      window.removeEventListener("dialer:activity", touch);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return null;
}
