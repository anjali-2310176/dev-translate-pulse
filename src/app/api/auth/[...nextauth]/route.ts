import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: "Demo Executive Account",
      credentials: {
        email: { label: "Email (Any)", type: "text", placeholder: "executive@demo.com" },
        password: { label: "Password (Any)", type: "password", placeholder: "demo123" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        
        // Auto-provision demo account
        const user = await prisma.user.upsert({
          where: { email: credentials.email },
          update: {},
          create: {
            email: credentials.email,
            name: credentials.email.split('@')[0] || "Executive",
          }
        });
        
        return user;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user && token.uid) {
        session.user.id = token.uid as string;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
