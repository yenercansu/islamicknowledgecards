import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token?.sub) (session.user as any).id = token.sub
      return session
    },
  },
})

export const GET = handlers.GET
export const POST = handlers.POST
