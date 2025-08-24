"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

// Sticky header örnek
const Navigation = () => {
  const { status, data } = useSession()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className={`w-full top-0 z-40 ${scrolled ? "bg-white/70 backdrop-blur border-b" : "bg-transparent"}`}>
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold">
          Islamic Knowledge Cards
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-teal-600 transition-colors">
            HOME
          </Link>
          <Link href="/daily-practice" className="text-sm font-medium hover:text-teal-600 transition-colors">
            PRACTICE
          </Link>
          <Link href="/saved" className="text-sm font-medium hover:text-teal-600 transition-colors">
            SAVED
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/login" className="rounded-full border px-3 py-1.5 text-sm hover:bg-gray-50">
            Sign in
          </Link>
        </div>
      </div>
    </header>
  )
}

export { Navigation }
export default Navigation
