import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { site } from "@/config/site";
import LoginForm from "@/components/dialer/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; timeout?: string }>;
}) {
  const session = await auth();
  const { callbackUrl, timeout } = await searchParams;

  if (session?.user) {
    redirect(callbackUrl && callbackUrl.startsWith("/dialer") ? callbackUrl : "/dialer");
  }

  return (
    <div className="grain relative flex min-h-dvh items-center justify-center px-5 py-16">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 100%, rgba(201,247,58,0.1), transparent 60%)",
        }}
        aria-hidden
      />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-display text-2xl font-bold tracking-tight">
            {site.shortName}
            <span className="text-lime">.</span>
          </p>
          <p className="mt-2 font-label text-[11px] uppercase tracking-[0.25em] text-muted">
            Agent Dialer
          </p>
        </div>
        <div className="rounded-3xl border border-line bg-ink-2/80 p-7 backdrop-blur sm:p-8">
          <h1 className="font-display text-xl font-bold tracking-tight">
            Sign in
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Access is restricted to registered agents.
          </p>
          {timeout === "1" && (
            <p
              role="status"
              className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2.5 text-sm text-amber-300"
            >
              You were signed out after an hour of inactivity. Sign in
              again to continue.
            </p>
          )}
          <LoginForm
            callbackUrl={
              callbackUrl && callbackUrl.startsWith("/dialer")
                ? callbackUrl
                : "/dialer"
            }
          />
        </div>
      </div>
    </div>
  );
}
