import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Dialer from "@/components/dialer/Dialer";
import AutoRefresh from "@/components/dialer/AutoRefresh";

export const dynamic = "force-dynamic";

function startOfUtcDay(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}

function formatTalk(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

export default async function DialerPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/dialer/login");

  const userId = session.user.id;
  const start = startOfUtcDay();

  const [user, todayCalls, durAgg] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { recordingEnabled: true, dailyCallLimit: true },
    }),
    prisma.call.count({ where: { userId, createdAt: { gte: start } } }),
    prisma.call.aggregate({
      _sum: { durationSeconds: true },
      where: { userId, createdAt: { gte: start } },
    }),
  ]);

  const dailyLimit = user?.dailyCallLimit ?? 200;
  const talk = durAgg._sum.durationSeconds ?? 0;
  const remaining = Math.max(0, dailyLimit - todayCalls);

  const stats = [
    { label: "Calls today", value: String(todayCalls) },
    { label: "Talk time", value: formatTalk(talk) },
    { label: "Remaining", value: String(remaining) },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <AutoRefresh intervalMs={5000} />
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-label text-[11px] uppercase tracking-[0.25em] text-lime">
            Browser dialer
          </p>
          <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Make a call
          </h1>
        </div>
        <dl className="grid grid-cols-3 gap-3 sm:gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-line bg-ink-2 px-4 py-3 text-center"
            >
              <dd className="font-display text-xl font-bold text-lime sm:text-2xl">
                {s.value}
              </dd>
              <dt className="mt-0.5 font-label text-[10px] uppercase tracking-wider text-muted">
                {s.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>

      <Dialer recordingEnabled={user?.recordingEnabled ?? true} />
    </div>
  );
}
