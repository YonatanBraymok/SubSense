// auth.ts
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma"; // use your existing prisma helper

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Adapter tells NextAuth to persist users/sessions to Postgres via Prisma
  adapter: PrismaAdapter(prisma),

  // Providers: GitHub OAuth. With v5 env inference, we can omit clientId/secret
  // if AUTH_GITHUB_ID / AUTH_GITHUB_SECRET are in .env.
  providers: [GitHub],

  // Optional: explicit session strategy (defaults to "database" when adapter is set)
  // session: { strategy: "database" },

  // Optional: custom pages (we’ll keep the default for now)
  // pages: { signIn: "/login" },

  // Optional: callbacks (e.g., to add user.id to the session object)
  // callbacks: {
  //   session({ session, user }) {
  //     if (session.user) (session.user as any).id = user.id;
  //     return session;
  //   },
  // },
});