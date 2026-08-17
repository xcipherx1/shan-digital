import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { site } from "@/config/site";
import SignOutButton from "@/components/dialer/SignOutButton";
import IdleLogout from "@/components/dialer/IdleLogout";
import AppSwitcher from "@/components/workspace/AppSwitcher";

export const metadata: Metadata = {
  title: "Leads Dashboard",
  robots: { index: false, follow: false },
};

/**
 * Leads workspace — completely separate from the dialer shell, with its
 * own nav, but signed in with the same credentials. Admin-only: leads
 * are commercially sensitive, so agents are sent to the dialer instead.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/dialer/login?callbackUrl=/dashboard");
  if (session.user.role !== "admin") redirect("/dialer");

  return (
    <div className="flex min-h-dvh flex-col bg-ink text-mist">
      <IdleLogout />
      <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-8">
          <div className="flex min-w-0 items-center gap-4 sm:gap-6">
            <Link
              href="/dashboard"
              className="hidden shrink-0 font-display text-lg font-bold tracking-tight sm:block"
            >
              {site.shortName}
              <span className="text-lime">.</span>
            </Link>
            <AppSwitcher current="leads" isAdmin />
            <nav className="flex items-center gap-5" aria-label="Leads">
              <Link
                href="/dashboard"
                className="font-label text-xs uppercase tracking-wider text-muted transition-colors duration-200 hover:text-lime"
              >
                All leads
              </Link>
              <Link
                href="/landing"
                target="_blank"
                className="hidden font-label text-xs uppercase tracking-wider text-muted transition-colors duration-200 hover:text-lime sm:inline"
              >
                View funnel
              </Link>
            </nav>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden text-xs text-muted lg:inline">
              {session.user.name}
              <span className="ml-2 rounded-full bg-lime/15 px-2 py-0.5 font-label text-[10px] uppercase tracking-wider text-lime">
                Admin
              </span>
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
