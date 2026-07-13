"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { LoaderCircle, LogIn } from "lucide-react";

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (!res || res.error) {
      // Generic message — never reveal which field was wrong.
      setError("Invalid email or password.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  const inputCls =
    "w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm text-mist placeholder:text-muted/60 transition-colors duration-200 focus:border-lime focus:outline-none";

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block font-label text-[11px] uppercase tracking-wider text-muted"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={inputCls}
          placeholder="agent@shandigitalmarketing.com"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block font-label text-[11px] uppercase tracking-wider text-muted"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputCls}
          placeholder="••••••••••••"
        />
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-sm text-red-300"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-lime px-6 py-3.5 font-display text-sm font-bold text-coal transition-colors duration-200 hover:bg-lime-deep disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <LoaderCircle className="size-4 animate-spin" aria-hidden />
            Signing in…
          </>
        ) : (
          <>
            <LogIn className="size-4" aria-hidden />
            Sign in
          </>
        )}
      </button>
    </form>
  );
}
