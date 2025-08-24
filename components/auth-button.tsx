"use client"

import { useSession, signOut } from "next-auth/react"
import { LogOut, User } from "lucide-react"

export function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") return null

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-white/80">
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">{session.user?.name}</span>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 px-3 py-2 text-sm text-white transition-colors"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    )
  }

  return null
}
