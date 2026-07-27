import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { site } from "@/config/site";
import LeadsBoard from "@/components/dashboard/LeadsBoard";
import SignOutButton from "@/components/dialer/SignOutButton";
import IdleLogout from "@/components/dialer/IdleLogout";

export const metadata: Metadata = {
  title: "Leads Dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/dialer/login?callbackUrl=/dashboard");
  }
  // Leads are commercially sensitive — admins only. Agents get the dialer.
  if (session.user.role !== "admin") {
    redirect("/dialer");
  }

  return (
    <div className="flex min-h-dvh flex-col bg-ink text-mist">
      <IdleLogout />
      <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="font-display text-lg font-bold tracking-tight">
              {site.shortName}
              <span className="text-lime">.</span>
              <span className="ml-2 hidden font-label text-[10px] font-medium uppercase tracking-[0.2em] text-muted sm:inline">
                Leads
              </span>
            </Link>
            <nav className="flex items-center gap-6" aria-label="Admin">
              <Link
                href="/dashboard"
                className="font-label text-xs uppercase tracking-wider text-lime"
              >
                Leads
              </Link>
              <Link
                href="/dialer"
                className="font-label text-xs uppercase tracking-wider text-muted transition-colors duration-200 hover:text-lime"
              >
                Dialer
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-muted sm:inline">
              {session.user.name}
              <span className="ml-2 rounded-full bg-lime/15 px-2 py-0.5 font-label text-[10px] uppercase tracking-wider text-lime">
                Admin
              </span>
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-8 sm:py-10">
        <div className="mb-6">
          <p className="font-label text-[11px] uppercase tracking-[0.25em] text-lime">
            Roofing funnel
          </p>
          <h1 className="font-display mt-1.5 text-2xl font-extrabold tracking-tight sm:text-4xl">
            Leads
          </h1>
        </div>
        <LeadsBoard />
      </main>
    </div>
  );
}
