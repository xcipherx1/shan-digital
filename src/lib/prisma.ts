import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton. In development Next.js hot-reload would
 * otherwise open a new connection pool on every reload and exhaust the
 * database, so we cache the instance on globalThis.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
