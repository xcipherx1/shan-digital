import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { site } from "@/config/site";
import SignOutButton from "@/components/dialer/SignOutButton";

export const metadata: Metadata = {
  title: "Dialer",
  robots: { index: false, follow: false },
};

export default async function DialerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex min-h-dvh flex-col bg-ink text-mist">
      {session?.user && (
        <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
            <div className="flex items-center gap-8">
              <Link href="/dialer" className="font-display text-lg font-bold tracking-tight">
                {site.shortName}
                <span className="text-lime">.</span>
                <span className="ml-2 hidden font-label text-[10px] font-medium uppercase tracking-[0.2em] text-muted sm:inline">
                  Dialer
                </span>
              </Link>
              <nav className="flex items-center gap-6" aria-label="Dialer">
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
            <div className="flex items-center gap-4">
              <span className="hidden text-xs text-muted sm:inline">
                {session.user.name}
                {session.user.role === "admin" && (
                  <span className="ml-2 rounded-full bg-lime/15 px-2 py-0.5 font-label text-[10px] uppercase tracking-wider text-lime">
                    Admin
                  </span>
                )}
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
