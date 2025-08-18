// src/types/next-auth.d.ts
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      displayName?: string | null;
      defaultCurrency?: string | null;
      timezone?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    displayName?: string | null;
    defaultCurrency?: string | null;
    timezone?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}