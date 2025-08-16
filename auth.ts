// auth.ts
import NextAuth, { type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const config: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [GitHub],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // Thanks to module augmentation, user.id is typed
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image ?? token.picture;
      }

      if (trigger === "update" && session) {
        if ("name" in session) {
          token.name = session.name as string;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token?.id) {
        session.user.id = token.id as string;
      }

      if (session.user?.id) {
        const u = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: {
            displayName: true,
            defaultCurrency: true,
            timezone: true,
          },
        });

        session.user.displayName = u?.displayName ?? null;
        session.user.defaultCurrency = u?.defaultCurrency ?? null;
        session.user.timezone = u?.timezone ?? null;
      }

      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
export default config;