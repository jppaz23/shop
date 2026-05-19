import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
        const email = (user.email ?? "").toLowerCase();
        const isAdminByEnv = adminEmails.includes(email);
        const dbRole = (user as { role?: string }).role;
        session.user.isAdmin = isAdminByEnv || dbRole === "ADMIN";

        if (isAdminByEnv && dbRole !== "ADMIN") {
          await prisma.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
        }
      }
      return session;
    },
  },
});
