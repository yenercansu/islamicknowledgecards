"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSaved, unsave } from "@/lib/saved"

export default function SavedPage() {
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])

  const refresh = () => setItems(getSaved())

  useEffect(() => {
    refresh()
    const onStorage = () => refresh()
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-100 to-teal-300 p-6">
      {/* Back */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/")}
          className="h-11 w-11 rounded-full bg-white/70 hover:bg-white/90 shadow grid place-items-center"
          aria-label="Back to Home"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      <h1 className="text-3xl font-extrabold mb-4">Saved Questions</h1>

      {!items.length ? (
        <p className="text-slate-700">You have no saved cards yet.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((it) => (
            <li key={it.uid}>
              <div className="relative rounded-2xl bg-white p-4 shadow border border-slate-200">
                {/* Row content is a button so the whole text opens the card */}
                <button
                  onClick={() => {
                    const slug = it.slug || it.section || "deck"
                    const q = new URLSearchParams({ card: it.uid, from: "saved" }).toString()
                    router.push(`/deck/${slug}?${q}`)
                  }}
                  className="block w-full text-left pr-12" // leave room for the icon at right
                >
                  <div className="text-sm text-slate-500 mb-1">{it.section || it.slug || "Deck"}</div>
                  <div className="font-semibold text-slate-800">{it.question}</div>
                </button>

                {/* Bookmark on the right: selected by default. Click to unsave. */}
                <button
                  onClick={(e) => {
                    e.stopPropagation() // do not navigate
                    unsave(it.uid)
                    refresh() // re-read list so the row disappears
                  }}
                  aria-label="Unsave"
                  title="Unsave"
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full hover:bg-slate-100 grid place-items-center"
                >
                  {/* filled icon to indicate saved state */}
                  <svg width="20" height="20" viewBox="0 0 24 24" className="text-teal-700" fill="currentColor">
                    <path d="M6 2h12v20l-6-4-6 4V2z" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
