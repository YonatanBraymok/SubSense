import NextAuth, { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      displayName?: string | null;
      defaultCurrency?: string | null;
      timezone?: string | null;
    };
  }

  declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}

  interface User {
    id: string;
    displayName?: string | null;
    defaultCurrency?: string | null;
    timezone?: string | null;
  }
}