import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "agent" | "admin";
    } & DefaultSession["user"];
  }

  interface User {
    role?: "agent" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "agent" | "admin";
  }
}
