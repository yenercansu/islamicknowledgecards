"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

// Sticky header örnek
const Navigation = () => {
  const { status, data } = useSession()
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const navItem = (href: string, label: string) => {
    const active = pathname === href || pathname?.startsWith(href + "/")
    return (
      <Link
        href={href}
        className={cn(
          "text-sm transition-colors font-bold text-teal-400 opacity-90 rounded-2xl",
          active ? "font-bold text-teal-800" : "font-medium text-teal-700 hover:font-bold hover:text-teal-800",
        )}
      >
        {label}
      </Link>
    )
  }

  return (
    <header className={`w-full top-0 z-40 ${scrolled ? "bg-white/70 backdrop-blur border-b" : "bg-transparent"}`}>
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-center relative">
        <Link href="/" className="font-semibold absolute left-4 text-teal-400">
          Islamic Knowledge Cards
        </Link>

        <nav className="flex items-center gap-10 shadow-none">
          {navItem("/", "HOME")}
          {navItem("/daily-practice", "PRACTICE")}
          {navItem("/saved", "SAVED")}
        </nav>

        <div className="flex items-center gap-2 absolute right-4">
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
