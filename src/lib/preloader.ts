/**
 * Tiny coordination layer between the Preloader overlay and sections
 * (like the Hero) whose intro animations must wait for the reveal.
 */

export const PRELOADER_DONE_EVENT = "shan:preloader-done";

export const preloaderState = { done: false };

export function markPreloaderDone() {
  preloaderState.done = true;
  window.dispatchEvent(new CustomEvent(PRELOADER_DONE_EVENT));
}

/** Runs `cb` once the preloader has finished (immediately if it already has). */
export function oncePreloaderDone(cb: () => void): () => void {
  if (preloaderState.done) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(PRELOADER_DONE_EVENT, handler, { once: true });
  return () => window.removeEventListener(PRELOADER_DONE_EVENT, handler);
}
