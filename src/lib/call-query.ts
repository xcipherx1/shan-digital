import type { Prisma } from "@prisma/client";

export type CallFilters = {
  from?: string;
  to?: string;
  status?: string;
  disposition?: string;
  q?: string;
};

/** Normalise raw string params into a clean filter object. */
export function normaliseFilters(get: (key: string) => string | undefined): CallFilters {
  const clean = (v: string | undefined) => {
    const t = v?.trim();
    return t ? t : undefined;
  };
  return {
    from: clean(get("from")),
    to: clean(get("to")),
    status: clean(get("status")),
    disposition: clean(get("disposition")),
    q: clean(get("q")),
  };
}

/**
 * Build a Prisma where-clause. Non-admins are always hard-scoped to
 * their own calls — the filter can never widen that.
 */
export function buildCallWhere(
  userId: string,
  isAdmin: boolean,
  f: CallFilters,
): Prisma.CallWhereInput {
  const where: Prisma.CallWhereInput = {};
  if (!isAdmin) where.userId = userId;

  const createdAt: Prisma.DateTimeFilter = {};
  if (f.from) {
    const d = new Date(f.from);
    if (!Number.isNaN(d.getTime())) createdAt.gte = d;
  }
  if (f.to) {
    const d = new Date(f.to);
    if (!Number.isNaN(d.getTime())) {
      d.setHours(23, 59, 59, 999);
      createdAt.lte = d;
    }
  }
  if (createdAt.gte || createdAt.lte) where.createdAt = createdAt;

  if (f.status) where.status = f.status;
  if (f.disposition) where.disposition = f.disposition;
  if (f.q) where.toNumber = { contains: f.q };

  return where;
}
