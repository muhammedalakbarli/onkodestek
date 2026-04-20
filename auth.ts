import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import { users, accounts, sessions, verificationTokens } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable:              users,
    accountsTable:           accounts,
    sessionsTable:           sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Google({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Rol məlumatını sessiyaya əlavə et
      const [dbUser] = await db.select().from(users).where(eq(users.id, user.id));
      if (dbUser) {
        session.user.id   = dbUser.id;
        session.user.role = dbUser.role;
      }
      return session;
    },
    async signIn({ user }) {
      // Admin emailləri avtomatik admin rolu alır
      const email = user.email?.toLowerCase() ?? "";
      if (ADMIN_EMAILS.includes(email)) {
        // Rolunu admin et (ilk girişdə)
        setTimeout(async () => {
          try {
            const [existing] = await db.select().from(users).where(eq(users.email, email));
            if (existing && existing.role !== "admin") {
              await db.update(users).set({ role: "admin" }).where(eq(users.email, email));
            }
          } catch { /* ignore */ }
        }, 500);
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "database",
    maxAge:   60 * 60 * 24 * 30, // 30 gün
  },
});

// TypeScript: session-a role əlavə et
declare module "next-auth" {
  interface Session {
    user: {
      id:    string;
      name:  string | null;
      email: string | null;
      image: string | null;
      role:  "admin" | "donor";
    };
  }
}
