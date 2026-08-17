import { auth } from "@/auth";
import LeadsBoard from "@/components/dashboard/LeadsBoard";

export const dynamic = "force-dynamic";

/** Auth + chrome are handled by the dashboard layout. */
export default async function DashboardPage() {
  await auth();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-8 sm:py-10">
      <div className="mb-6">
        <p className="font-label text-[11px] uppercase tracking-[0.25em] text-lime">
          Roofing funnel
        </p>
        <h1 className="font-display mt-1.5 text-2xl font-extrabold tracking-tight sm:text-4xl">
          Leads
        </h1>
      </div>
      <LeadsBoard />
    </div>
  );
}
