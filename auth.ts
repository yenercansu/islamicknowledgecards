import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

const disabled =
  process.env.DISABLE_AUTH === "true" || !process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET

let handlers: { GET: any; POST: any }
let auth: any
let signIn: any
let signOut: any

if (!disabled) {
  const result = NextAuth({
    providers: [
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ],
    pages: { signIn: "/login" },
    session: { strategy: "jwt" },
    callbacks: {
      async session({ session, token }: any) {
        if (session?.user && token?.sub) (session.user as any).id = token.sub
        return session
      },
    },
  })
  handlers = result.handlers
  auth = result.auth
  signIn = result.signIn
  signOut = result.signOut
} else {
  const fallback = () =>
    new Response(JSON.stringify({ auth: "disabled" }), {
      status: 503,
      headers: { "content-type": "application/json" },
    })
  handlers = { GET: fallback, POST: fallback }
  auth = async () => null
  signIn = async () => {
    throw new Error("Auth disabled")
  }
  signOut = async () => {}
}

export { handlers, auth, signIn, signOut }
