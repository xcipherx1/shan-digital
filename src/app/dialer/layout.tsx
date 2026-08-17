import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { site } from "@/config/site";
import SignOutButton from "@/components/dialer/SignOutButton";
import IdleLogout from "@/components/dialer/IdleLogout";
import AppSwitcher from "@/components/workspace/AppSwitcher";

export const metadata: Metadata = {
  title: "Dialer",
  robots: { index: false, follow: false },
};

/**
 * Agent dialer workspace. Separate shell from the leads dashboard —
 * its nav only ever contains dialer pages — but both sign in with the
 * same credentials, and admins can hop between them via AppSwitcher.
 */
export default async function DialerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="flex min-h-dvh flex-col bg-ink text-mist">
      {session?.user && <IdleLogout />}
      {session?.user && (
        <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-8">
            <div className="flex min-w-0 items-center gap-4 sm:gap-6">
              <Link
                href="/dialer"
                className="hidden shrink-0 font-display text-lg font-bold tracking-tight sm:block"
              >
                {site.shortName}
                <span className="text-lime">.</span>
              </Link>
              <AppSwitcher current="dialer" isAdmin={isAdmin} />
              <nav className="flex items-center gap-5" aria-label="Dialer">
                <Link
                  href="/dialer"
                  className="font-label text-xs uppercase tracking-wider text-muted transition-colors duration-200 hover:text-lime"
                >
                  Dial
                </Link>
                <Link
                  href="/dialer/history"
                  className="font-label text-xs uppercase tracking-wider text-muted transition-colors duration-200 hover:text-lime"
                >
                  History
                </Link>
              </nav>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="hidden text-xs text-muted lg:inline">
                {session.user.name}
              </span>
              <SignOutButton />
            </div>
          </div>
        </header>
      )}
      <main className="flex-1">{children}</main>
    </div>
  );
}
