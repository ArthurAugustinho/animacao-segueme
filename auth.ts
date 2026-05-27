import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/lib/db/schema";

const ADMIN_USERNAME = process.env.ADMIN_GITHUB_USERNAME;

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [GitHub],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ profile }) {
      // Permite apenas o admin definido em ADMIN_GITHUB_USERNAME
      if (!ADMIN_USERNAME) return false;
      const username = (profile as { login?: string } | null)?.login;
      return username === ADMIN_USERNAME;
    },
  },
});
