import { NextResponse } from "next/server"

let GET: any
let POST: any

try {
  // Try to import handlers from auth configuration
  const authModule = await import("@/auth")
  GET = authModule.handlers.GET
  POST = authModule.handlers.POST
} catch (error) {
  console.error("Failed to load auth handlers:", error)

  const fallbackHandler = () => {
    return NextResponse.json({ error: "Authentication not configured" }, { status: 503 })
  }

  GET = fallbackHandler
  POST = fallbackHandler
}

export { GET, POST }
