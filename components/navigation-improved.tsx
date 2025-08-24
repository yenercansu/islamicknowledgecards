"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils" // if you do not have this helper, replace cn(...) with a string of classes

export default function Navigation() {
  const pathname = usePathname()

  const item = (href: string, label: string) => {
    const active = pathname === href || pathname?.startsWith(href + "/")
    return (
      <Link
        href={href}
        className={cn(
          "rounded-full px-4 py-2 text-sm transition",
          active ? "bg-emerald-100 text-emerald-700" : "text-gray-700 hover:bg-gray-100",
        )}
      >
        {label}
      </Link>
    )
  }

  return (
    <header className="w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Brand sends to home so no separate Home link needed */}
        <Link href="/" className="text-base font-semibold tracking-tight">
          Islamic Knowledge Cards
        </Link>

        {/* Bigger spacing between items */}
        <nav className="flex items-center gap-8 md:gap-10">
          {item("/practice", "Practice")}
          {item("/saved", "Saved")}
        </nav>
      </div>
    </header>
  )
}
