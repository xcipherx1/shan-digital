"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/dialer/login" })}
      className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-2 font-label text-xs uppercase tracking-wider text-muted transition-colors duration-200 hover:border-lime hover:text-lime"
    >
      <LogOut className="size-3.5" aria-hidden />
      Sign out
    </button>
  );
}
