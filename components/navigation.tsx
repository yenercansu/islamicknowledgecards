"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User } from "lucide-react"
import { useState } from "react"
import DeleteAccountModal from "./delete-account-modal"

const Navigation = () => {
  const pathname = usePathname()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [isSignedIn, setIsSignedIn] = useState(false)

  const navItem = (href: string, label: string) => {
    const active = pathname === href || (href !== "/" && pathname?.startsWith(href))
    return (
      <Link
        href={href}
        className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all uppercase tracking-wide font-sans ${
          active ? "bg-teal-600 text-white" : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        {label}
      </Link>
    )
  }

  const handleDeleteAccount = () => {
    console.log("[v0] Delete account confirmed")
    setShowDeleteModal(false)
    setShowProfileMenu(false)
    setIsSignedIn(false)
  }

  return (
    <>
      <header className="w-full bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between font-sans">
          <Link href="/" className="font-bold text-gray-900 text-xl font-sans">
            Islamic Knowledge Cards
          </Link>

          <nav className="flex items-center gap-2">
            {navItem("/", "HOME")}
            {navItem("/daily-practice", "PRACTICE")}
            {navItem("/saved", "SAVED")}
          </nav>

          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <>
                {/* Signed in: Show profile icon and SIGN OUT button */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="p-2.5 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <User className="w-6 h-6 text-gray-700" />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <button
                        onClick={() => {
                          setShowDeleteModal(true)
                          setShowProfileMenu(false)
                        }}
                        className="w-full px-4 py-3 text-left text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                      >
                        Delete Account Forever
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsSignedIn(false)}
                  className="px-6 py-2.5 rounded-full bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors uppercase tracking-wide"
                >
                  SIGN OUT
                </button>
              </>
            ) : (
              <>
                {/* Not signed in: Show SIGN IN button only */}
                <Link
                  href="/login"
                  className="px-6 py-2.5 rounded-full bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors uppercase tracking-wide font-sans"
                >
                  SIGN IN
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
      />
    </>
  )
}

export { Navigation }
export default Navigation
