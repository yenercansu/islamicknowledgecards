"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User } from "lucide-react"

const Navigation = () => {
  const pathname = usePathname()

  const navItem = (href: string, label: string) => {
    const active = pathname === href || (href !== "/" && pathname?.startsWith(href))
    return (
      <Link
        href={href}
        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
          active ? "bg-teal-600 text-white" : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        {label}
      </Link>
    )
  }

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-gray-900 text-lg">
          Islamic Knowledge Cards
        </Link>

        <nav className="flex items-center gap-2">
          {navItem("/", "HOME")}
          {navItem("/daily-practice", "PRACTICE")}
          {navItem("/saved", "SAVED")}
        </nav>

        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <User className="w-5 h-5 text-gray-700" />
          </button>
          <Link
            href="/login"
            className="px-4 py-2 rounded-full bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors"
          >
            SIGN OUT
          </Link>
        </div>
      </div>
    </header>
  )
}

export { Navigation }
export default Navigation
