"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Device, Call } from "@twilio/voice-sdk";
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Delete,
  Circle,
  ShieldAlert,
  LoaderCircle,
  Volume2,
  Grid3x3,
} from "lucide-react";
import { DISPOSITIONS, type Disposition } from "@/lib/dispositions";

type Status = "offline" | "connecting" | "ready" | "oncall" | "error";
type Phase = "idle" | "dialing" | "ringing" | "active";

const KEYS = [
  ["1", ""],
  ["2", "ABC"],
  ["3", "DEF"],
  ["4", "GHI"],
  ["5", "JKL"],
  ["6", "MNO"],
  ["7", "PQRS"],
  ["8", "TUV"],
  ["9", "WXYZ"],
  ["*", ""],
  ["0", "+"],
  ["#", ""],
] as const;

const STATUS_META: Record<Status, { label: string; dot: string; text: string }> = {
  offline: { label: "Offline", dot: "bg-muted", text: "text-muted" },
  connecting: { label: "Connecting", dot: "bg-amber-400", text: "text-amber-400" },
  ready: { label: "Ready", dot: "bg-lime", text: "text-lime" },
  oncall: { label: "On call", dot: "bg-teal", text: "text-teal" },
  error: { label: "Error", dot: "bg-red-400", text: "text-red-400" },
};

const PHASE_META: Record<Exclude<Phase, "idle">, { label: string; ring: string }> = {
  dialing: { label: "Calling", ring: "border-amber-400/60 text-amber-300" },
  ringing: { label: "Ringing", ring: "border-amber-400/60 text-amber-300" },
  active: { label: "Connected", ring: "border-teal/60 text-teal" },
};

function looksValidUk(n: string): boolean {
  return /^\+44\d{7,12}$/.test(n);
}

function formatTimer(total: number): string {
  const m = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function Dialer({
  recordingEnabled: initialRecording,
}: {
  recordingEnabled: boolean;
}) {
  const [status, setStatus] = useState<Status>("offline");
  const [phase, setPhase] = useState<Phase>("idle");
  const [number, setNumber] = useState("+44");
  const [errorMsg, setErrorMsg] = useState("");
  const [fatalError, setFatalError] = useState("");
  const [muted, setMuted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [recording, setRecording] = useState(initialRecording);
  const [dispoFor, setDispoFor] = useState<string | null>(null);
  const [speakerAvailable, setSpeakerAvailable] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [showDtmf, setShowDtmf] = useState(false);
  const router = useRouter();

  const onCall = phase !== "idle";

  const deviceRef = useRef<Device | null>(null);
  const callRef = useRef<Call | null>(null);
  const callSidRef = useRef<string | null>(null);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchToken = useCallback(async () => {
    const res = await fetch("/api/twilio/token", { method: "POST" });
    if (!res.ok) throw new Error("token request failed");
    return (await res.json()) as {
      token: string;
      identity: string;
      expiresAt: number;
      recordingEnabled: boolean;
    };
  }, []);

  // Held in a ref so the timeout can re-schedule itself without the
  // callback referencing its own binding before declaration.
  const scheduleRefreshRef = useRef<(expiresAt: number) => void>(() => {});
  const scheduleRefresh = useCallback(
    (expiresAt: number) => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      const delay = Math.max(0, expiresAt - Date.now() - 5 * 60 * 1000);
      refreshTimer.current = setTimeout(async () => {
        try {
          const d = await fetchToken();
          deviceRef.current?.updateToken(d.token);
          scheduleRefreshRef.current(d.expiresAt);
        } catch {
          /* the tokenWillExpire handler is the backup */
        }
      }, delay);
    },
    [fetchToken],
  );
  useEffect(() => {
    scheduleRefreshRef.current = scheduleRefresh;
  }, [scheduleRefresh]);

  const stopTick = useCallback(() => {
    if (tickTimer.current) {
      clearInterval(tickTimer.current);
      tickTimer.current = null;
    }
  }, []);

  const finishCall = useCallback(
    (promptDisposition: boolean) => {
      stopTick();
      const sid = callSidRef.current;
      callRef.current = null;
      setPhase("idle");
      setMuted(false);
      setShowDtmf(false);
      setStatus(deviceRef.current ? "ready" : "offline");
      if (promptDisposition && sid) setDispoFor(sid);
      // Pull fresh today-stats; the status webhook lags a beat, so
      // refresh again shortly after.
      router.refresh();
      setTimeout(() => router.refresh(), 4000);
    },
    [stopTick, router],
  );

  const attachCall = useCallback(
    (call: Call) => {
      callRef.current = call;
      callSidRef.current = null;
      setPhase("dialing");
      setStatus("oncall");
      setSeconds(0);

      const capture = () => {
        const sid = call.parameters?.CallSid;
        if (sid) callSidRef.current = sid;
      };

      call.on("ringing", () => {
        capture();
        setPhase("ringing");
      });
      call.on("accept", () => {
        capture();
        setPhase("active");
        stopTick();
        setSeconds(0);
        tickTimer.current = setInterval(() => setSeconds((s) => s + 1), 1000);
      });
      call.on("disconnect", () => {
        capture();
        finishCall(true);
      });
      call.on("cancel", () => finishCall(false));
      call.on("reject", () => finishCall(false));
      call.on("error", (e: { message?: string }) => {
        setErrorMsg(e?.message ?? "Call error.");
        finishCall(false);
      });
    },
    [finishCall, stopTick],
  );

  // Initialise the Twilio Device once, after checking HTTPS + mic access.
  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!window.isSecureContext) {
        setFatalError(
          "The dialer requires a secure (HTTPS) connection to access your microphone.",
        );
        setStatus("error");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
      } catch {
        setFatalError(
          "Microphone access was denied. Enable it in your browser settings to make calls.",
        );
        setStatus("error");
        return;
      }

      setStatus("connecting");
      try {
        const data = await fetchToken();
        if (cancelled) return;
        setRecording(data.recordingEnabled);

        const device = new Device(data.token, {
          codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU],
          logLevel: "error",
        });
        deviceRef.current = device;
        scheduleRefresh(data.expiresAt);

        // Clean up the agent's microphone: browser-level noise
        // suppression, echo cancellation and automatic gain control.
        device.audio
          ?.setAudioConstraints({
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          })
          .catch(() => {
            /* an unsupported constraint combo is non-fatal */
          });

        device.on("registered", () => {
          setStatus("ready");
          // Speaker routing is only possible where the browser supports
          // output selection (desktop Chrome/Edge, Android Chrome).
          setSpeakerAvailable(
            Boolean(device.audio?.isOutputSelectionSupported),
          );
        });
        device.on("unregistered", () => setStatus("offline"));
        device.on("error", (e: { message?: string }) => {
          setStatus("error");
          setErrorMsg(e?.message ?? "Calling service error.");
        });
        device.on("tokenWillExpire", async () => {
          try {
            const d = await fetchToken();
            deviceRef.current?.updateToken(d.token);
            scheduleRefresh(d.expiresAt);
          } catch {
            /* ignore */
          }
        });

        await device.register();
      } catch {
        if (!cancelled) {
          setStatus("error");
          setFatalError("Could not connect to the calling service.");
        }
      }
    }

    init();

    return () => {
      cancelled = true;
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      if (tickTimer.current) clearInterval(tickTimer.current);
      callRef.current?.disconnect();
      deviceRef.current?.destroy();
      deviceRef.current = null;
    };
  }, [fetchToken, scheduleRefresh]);

  // Warn before leaving the page while a call is active.
  useEffect(() => {
    if (!onCall) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [onCall]);

  // An active call counts as activity for the idle-logout timer, even
  // if the agent doesn't touch anything for the whole conversation.
  useEffect(() => {
    if (!onCall) return;
    const ping = () => window.dispatchEvent(new Event("dialer:activity"));
    ping();
    const id = setInterval(ping, 30_000);
    return () => clearInterval(id);
  }, [onCall]);

  const placeCall = useCallback(async () => {
    const device = deviceRef.current;
    if (!device || status !== "ready") return;
    if (!looksValidUk(number)) {
      setErrorMsg("Enter a valid UK number in +44 format.");
      return;
    }
    setErrorMsg("");
    try {
      const call = await device.connect({ params: { To: number } });
      attachCall(call);
    } catch {
      setErrorMsg("Could not start the call.");
    }
  }, [attachCall, number, status]);

  const hangup = useCallback(() => {
    callRef.current?.disconnect();
  }, []);

  const toggleMute = useCallback(() => {
    const call = callRef.current;
    if (!call) return;
    const next = !muted;
    call.mute(next);
    setMuted(next);
  }, [muted]);

  const toggleSpeaker = useCallback(async () => {
    const audio = deviceRef.current?.audio;
    if (!audio) return;
    const next = !speakerOn;
    try {
      if (next) {
        // Prefer an output that identifies as a speaker (phones expose
        // "Speakerphone"); otherwise fall back to the default device.
        const outputs = Array.from(audio.availableOutputDevices.values());
        const speaker =
          outputs.find((d) => /speaker/i.test(d.label))?.deviceId ?? "default";
        await audio.speakerDevices.set(speaker);
      } else {
        await audio.speakerDevices.set("default");
      }
      setSpeakerOn(next);
    } catch {
      setErrorMsg("Speaker switching isn't available on this device.");
    }
  }, [speakerOn]);

  const pressKey = useCallback(
    (key: string) => {
      if (onCall) {
        callRef.current?.sendDigits(key);
        return;
      }
      setNumber((n) => (n === "+44" && key === "0" ? "+44" : n + key));
    },
    [onCall],
  );

  const backspace = useCallback(() => {
    if (onCall) return;
    setNumber((n) => (n.length > 0 ? n.slice(0, -1) : n));
  }, [onCall]);

  // Keyboard bindings for the keypad.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (dispoFor) return;
      const target = e.target as HTMLElement;
      if (target.tagName === "TEXTAREA") return;
      if (/^[0-9*#]$/.test(e.key)) {
        pressKey(e.key);
      } else if (e.key === "Backspace" && target.tagName !== "INPUT") {
        backspace();
      } else if (e.key === "Enter") {
        if (onCall) hangup();
        else placeCall();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [backspace, dispoFor, hangup, onCall, placeCall, pressKey]);

  async function toggleRecording() {
    const next = !recording;
    setRecording(next);
    try {
      await fetch("/api/dialer/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordingEnabled: next }),
      });
    } catch {
      setRecording(!next); // revert on failure
    }
  }

  const meta = STATUS_META[status];
  const canCall = status === "ready" && !onCall && looksValidUk(number);

  if (fatalError) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-red-400/30 bg-red-400/5 p-8 text-center">
        <ShieldAlert className="mx-auto size-8 text-red-400" aria-hidden />
        <h2 className="font-display mt-4 text-lg font-bold">Dialer unavailable</h2>
        <p className="mt-2 text-sm text-muted">{fatalError}</p>
      </div>
    );
  }

  const keypad = (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {KEYS.map(([digit, letters]) => (
        <button
          key={digit}
          type="button"
          onClick={() => pressKey(digit)}
          className="group flex min-h-14 cursor-pointer flex-col items-center justify-center rounded-2xl border border-line bg-ink py-2.5 transition-colors duration-150 hover:border-lime/40 hover:bg-ink-3 active:scale-[0.97] sm:min-h-16"
        >
          <span className="font-display text-xl font-bold text-mist sm:text-2xl">
            {digit}
          </span>
          {letters && (
            <span className="font-label text-[9px] tracking-[0.2em] text-muted">
              {letters}
            </span>
          )}
        </button>
      ))}
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Status + recording */}
      <div className="mb-4 flex items-center justify-between sm:mb-6">
        <span
          className={`inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 font-label text-[11px] uppercase tracking-wider sm:px-3.5 sm:text-xs ${meta.text}`}
        >
          {status === "connecting" ? (
            <LoaderCircle className="size-3 animate-spin" aria-hidden />
          ) : (
            <span className={`size-2 rounded-full ${meta.dot}`} aria-hidden />
          )}
          {meta.label}
        </span>

        <button
          type="button"
          onClick={toggleRecording}
          className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 font-label text-[11px] uppercase tracking-wider transition-colors duration-200 sm:px-3.5 sm:text-xs ${
            recording
              ? "border-red-400/40 text-red-300"
              : "border-line text-muted hover:text-mist"
          }`}
          aria-pressed={recording}
          title="UK law requires informing the other party when recording."
        >
          <Circle
            className={`size-3 ${recording ? "fill-red-400 text-red-400" : ""}`}
            aria-hidden
          />
          Rec {recording ? "on" : "off"}
        </button>
      </div>

      <div className="rounded-3xl border border-line bg-ink-2 p-4 sm:p-7">
        {!onCall ? (
          <>
            {/* ── Idle: number entry + keypad ── */}
            <div className="flex items-center justify-between gap-3">
              <input
                aria-label="Phone number"
                value={number}
                inputMode="tel"
                onChange={(e) =>
                  setNumber(e.target.value.replace(/[^\d+*#]/g, ""))
                }
                className="w-full bg-transparent font-display text-2xl font-bold tracking-tight text-mist outline-none placeholder:text-muted/40 sm:text-4xl"
                placeholder="+44…"
              />
              {number.length > 3 && (
                <button
                  type="button"
                  onClick={backspace}
                  className="shrink-0 cursor-pointer rounded-full p-2 text-muted transition-colors hover:text-mist"
                  aria-label="Delete last digit"
                >
                  <Delete className="size-5" aria-hidden />
                </button>
              )}
            </div>

            <div className="mt-4 sm:mt-5">{keypad}</div>

            {errorMsg && (
              <p role="alert" className="mt-4 text-center text-sm text-red-300">
                {errorMsg}
              </p>
            )}

            <div className="mt-5 flex items-center justify-center sm:mt-6">
              <button
                type="button"
                onClick={placeCall}
                disabled={!canCall}
                className="flex h-14 w-full max-w-56 cursor-pointer items-center justify-center gap-2.5 rounded-full bg-lime font-display text-base font-bold text-coal transition-colors duration-200 hover:bg-lime-deep disabled:cursor-not-allowed disabled:opacity-40 sm:h-16"
                aria-label="Call"
              >
                <Phone className="size-5" aria-hidden />
                Call
              </button>
            </div>
          </>
        ) : (
          <>
            {/* ── Live call panel ── */}
            <div className="flex flex-col items-center pb-1 pt-4 text-center sm:pt-6">
              <div className="relative flex size-20 items-center justify-center sm:size-24">
                {phase !== "active" && (
                  <span
                    className="absolute inset-0 animate-ping rounded-full bg-amber-400/20"
                    aria-hidden
                  />
                )}
                <span
                  className={`relative flex size-16 items-center justify-center rounded-full border-2 bg-ink sm:size-20 ${PHASE_META[phase as Exclude<Phase, "idle">].ring}`}
                >
                  <Phone className="size-6 sm:size-7" aria-hidden />
                </span>
              </div>

              <p className="font-display mt-4 break-all text-2xl font-bold tracking-tight text-mist sm:text-3xl">
                {number}
              </p>
              <p
                className="mt-1.5 font-label text-sm uppercase tracking-[0.2em] text-muted"
                role="status"
                aria-live="polite"
              >
                {phase === "active" ? (
                  <span className="tabular-nums text-teal">
                    {formatTimer(seconds)}
                  </span>
                ) : (
                  <span className="text-amber-300">
                    {PHASE_META[phase as Exclude<Phase, "idle">].label}
                    <AnimatedDots />
                  </span>
                )}
              </p>
              {recording && phase === "active" && (
                <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-red-300">
                  <Circle className="size-2.5 fill-red-400 text-red-400" aria-hidden />
                  Recording — remember to inform the caller
                </p>
              )}
            </div>

            {showDtmf && <div className="mt-4">{keypad}</div>}

            {errorMsg && (
              <p role="alert" className="mt-4 text-center text-sm text-red-300">
                {errorMsg}
              </p>
            )}

            {/* In-call controls */}
            <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={toggleMute}
                className={`flex min-h-14 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border transition-colors duration-200 ${
                  muted
                    ? "border-amber-400/50 bg-amber-400/10 text-amber-300"
                    : "border-line text-muted hover:text-mist"
                }`}
                aria-pressed={muted}
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted ? (
                  <MicOff className="size-5" aria-hidden />
                ) : (
                  <Mic className="size-5" aria-hidden />
                )}
                <span className="font-label text-[10px] uppercase tracking-wider">
                  {muted ? "Muted" : "Mute"}
                </span>
              </button>

              <button
                type="button"
                onClick={toggleSpeaker}
                disabled={!speakerAvailable}
                title={
                  speakerAvailable
                    ? "Toggle speakerphone"
                    : "Speaker switching isn't supported by this browser — use your device's own audio controls."
                }
                className={`flex min-h-14 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
                  speakerOn
                    ? "border-lime/50 bg-lime/10 text-lime"
                    : "border-line text-muted hover:text-mist"
                }`}
                aria-pressed={speakerOn}
                aria-label={speakerOn ? "Speaker off" : "Speaker on"}
              >
                <Volume2 className="size-5" aria-hidden />
                <span className="font-label text-[10px] uppercase tracking-wider">
                  Speaker
                </span>
              </button>

              <button
                type="button"
                onClick={() => setShowDtmf((v) => !v)}
                className={`flex min-h-14 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border transition-colors duration-200 ${
                  showDtmf
                    ? "border-teal/50 bg-teal/10 text-teal"
                    : "border-line text-muted hover:text-mist"
                }`}
                aria-pressed={showDtmf}
                aria-label={showDtmf ? "Hide keypad" : "Show keypad"}
              >
                <Grid3x3 className="size-5" aria-hidden />
                <span className="font-label text-[10px] uppercase tracking-wider">
                  Keypad
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={hangup}
              className="mt-3 flex min-h-14 w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-red-500 font-display text-base font-bold text-white transition-colors duration-200 hover:bg-red-600 sm:mt-4"
              aria-label="Hang up"
            >
              <PhoneOff className="size-5" aria-hidden />
              {phase === "active" ? "End call" : "Cancel"}
            </button>
          </>
        )}
      </div>

      {dispoFor && (
        <DispositionModal
          callSid={dispoFor}
          onClose={() => setDispoFor(null)}
        />
      )}
    </div>
  );
}

/** Three dots that pulse in sequence while dialing/ringing. */
function AnimatedDots() {
  return (
    <span aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block animate-pulse"
          style={{ animationDelay: `${i * 280}ms` }}
        >
          .
        </span>
      ))}
    </span>
  );
}

function DispositionModal({
  callSid,
  onClose,
}: {
  callSid: string;
  onClose: () => void;
}) {
  const [disposition, setDisposition] = useState<Disposition | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function save() {
    setSaving(true);
    try {
      await fetch(`/api/dialer/calls/${encodeURIComponent(callSid)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disposition, notes: notes || null }),
      });
      router.refresh();
    } finally {
      setSaving(false);
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/70 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Log call outcome"
    >
      <div className="w-full max-w-md rounded-3xl border border-line bg-ink-2 p-6 sm:p-7">
        <h2 className="font-display text-lg font-bold tracking-tight">
          How did the call go?
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {DISPOSITIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDisposition(d)}
              className={`cursor-pointer rounded-xl border px-3 py-2.5 text-sm transition-colors duration-150 ${
                disposition === d
                  ? "border-lime bg-lime text-coal"
                  : "border-line text-muted hover:border-lime/40 hover:text-mist"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Notes (optional)…"
          className="mt-4 w-full resize-none rounded-xl border border-line bg-ink px-4 py-3 text-sm text-mist placeholder:text-muted/60 focus:border-lime focus:outline-none"
        />
        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full px-4 py-2.5 text-sm text-muted transition-colors hover:text-mist"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-lime px-6 py-2.5 font-display text-sm font-bold text-coal transition-colors hover:bg-lime-deep disabled:opacity-60"
          >
            {saving && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
