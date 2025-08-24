import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

const disabled =
  process.env.DISABLE_AUTH === "true" || !process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET

const fallbackHandler = () =>
  new Response(JSON.stringify({ message: "Authentication not configured" }), {
    status: 200,
    headers: { "content-type": "application/json" },
  })

let handlers: { GET: any; POST: any } = { GET: fallbackHandler, POST: fallbackHandler }
let auth: any = async () => null
let signIn: any = async () => {
  throw new Error("Auth not configured")
}
let signOut: any = async () => {}

if (!disabled) {
  try {
    const {
      handlers: nextAuthHandlers,
      auth: nextAuthAuth,
      signIn: nextAuthSignIn,
      signOut: nextAuthSignOut,
    } = NextAuth({
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
    handlers = nextAuthHandlers
    auth = nextAuthAuth
    signIn = nextAuthSignIn
    signOut = nextAuthSignOut
  } catch (error) {
    console.error("NextAuth configuration failed:", error)
    const errorHandler = () =>
      new Response(JSON.stringify({ error: "Auth configuration failed" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      })
    handlers = { GET: errorHandler, POST: errorHandler }
  }
} else {
  const disabledHandler = () =>
    new Response(JSON.stringify({ message: "Authentication disabled" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    })
  handlers = { GET: disabledHandler, POST: disabledHandler }
}

export { handlers, auth, signIn, signOut }
