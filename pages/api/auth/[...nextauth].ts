import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: { signIn: "/login" },   
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token?.sub) (session.user as any).id = token.sub;
      return session;
    },
  },
};

export default NextAuth(authOptions);
