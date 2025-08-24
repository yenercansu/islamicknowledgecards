import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async session({ session, token }: any) {
      return session
    },
    async jwt({ token }: any) {
      return token
    },
  },
}

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig)
