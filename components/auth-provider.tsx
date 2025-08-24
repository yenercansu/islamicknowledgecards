"use client"
import type { ReactNode } from "react"
import { SessionProvider } from "next-auth/react"

const disabled = process.env.NEXT_PUBLIC_DISABLE_AUTH === "true"

export default function AuthProvider({ children }: { children: ReactNode }) {
  if (disabled) return <>{children}</>
  return <SessionProvider>{children}</SessionProvider>
}
