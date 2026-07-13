/**
 * Seed / upsert dialer users. There is no public signup — this is the
 * only way users are created.
 *
 * Source of users (first that exists wins):
 *   1. SEED_USERS_JSON env var  — a JSON array string
 *   2. prisma/seed-users.json   — a local (gitignored) file
 *
 * Each entry: { "email": "...", "name": "...", "password": "...", "role"?: "agent"|"admin" }
 *
 * Run:  npm run db:seed
 */
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const prisma = new PrismaClient();

type SeedUser = {
  email: string;
  name: string;
  password: string;
  role?: "agent" | "admin";
};

function loadUsers(): SeedUser[] {
  if (process.env.SEED_USERS_JSON) {
    return JSON.parse(process.env.SEED_USERS_JSON) as SeedUser[];
  }
  const file = join(process.cwd(), "prisma", "seed-users.json");
  if (existsSync(file)) {
    return JSON.parse(readFileSync(file, "utf8")) as SeedUser[];
  }
  throw new Error(
    "No seed users found. Set SEED_USERS_JSON or create prisma/seed-users.json.",
  );
}

async function main() {
  const users = loadUsers();
  if (!Array.isArray(users) || users.length === 0) {
    throw new Error("Seed users must be a non-empty JSON array.");
  }

  for (const u of users) {
    if (!u.email || !u.name || !u.password) {
      throw new Error(
        `Each seed user needs email, name and password. Got: ${JSON.stringify(u)}`,
      );
    }
    const passwordHash = await bcrypt.hash(u.password, 12);
    const role = u.role === "admin" ? Role.admin : Role.agent;

    const user = await prisma.user.upsert({
      where: { email: u.email.toLowerCase() },
      create: {
        email: u.email.toLowerCase(),
        name: u.name,
        passwordHash,
        role,
      },
      update: {
        name: u.name,
        passwordHash,
        role,
        // Re-seeding clears any lockout so it doubles as a reset.
        failedAttempts: 0,
        lockedUntil: null,
        isActive: true,
      },
    });
    console.log(`Upserted ${user.role} ${user.email}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
