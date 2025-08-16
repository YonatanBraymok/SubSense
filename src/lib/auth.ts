// src/lib/auth.ts
import type { DefaultSession } from "next-auth";

// Re-export server helpers from your app's NextAuth instance
export { auth, signIn, signOut } from "auth";

// (Optional) Session augmentation
declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      displayName?: string | null;
      defaultCurrency?: string | null;
      timezone?: string | null;
    };
  }
}