import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import { users, accounts, sessions, verificationTokens } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { sendWelcomeEmail } from "@/lib/email";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
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
  // JWT strategy: Edge middleware-də DB sorğusu lazım deyil
  session: {
    strategy: "jwt",
    maxAge:   60 * 60 * 24 * 30, // 30 gün
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // İlk giriş: user məlumatları token-ə yazılır
        token.id    = user.id;
        token.email = user.email;
        const isAdmin = ADMIN_EMAILS.includes((user.email ?? "").toLowerCase());
        token.role  = isAdmin ? "admin" : ((user as { role?: string }).role ?? "donor");

        // Admin rolunu DB-də yenilə (fire-and-forget)
        if (isAdmin) {
          db.update(users)
            .set({ role: "admin" })
            .where(eq(users.email, user.email!))
            .catch(() => {});
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id    = (token.id as string) ?? token.sub ?? "";
        session.user.role  = (token.role as "admin" | "donor") ?? "donor";
        session.user.email = token.email ?? session.user.email;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      if (user.email) {
        sendWelcomeEmail({
          toEmail: user.email,
          toName: user.name ?? "İstifadəçi",
        }).catch(console.error);
      }
    },
  },
  pages: {
    signIn: "/login",
  },
});

// TypeScript: session-a id və role əlavə et
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

