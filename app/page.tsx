"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchAllDecks } from "@/lib/google-sheets"
import { getUserProgress } from "@/lib/storage"
import type { Deck } from "@/types/flashcard"
import Link from "next/link"
import { DeckCard } from "@/components/deck-card"
import { Search } from "lucide-react"
import Navigation from "@/components/navigation"

// Icon mapping for decks
const deckIconMap = {
  Aqeedah: "Star" as const,
  Fiqh: "Scale" as const,
  "Tazkiyah & Ihsan": "Heart" as const,
  History: "Clock" as const,
  "Hadith & Sahaba": "BookOpen" as const,
  Bidah: "AlertTriangle" as const,
  "Akhlaq & Adab": "Smile" as const,
  "Deen in Modern Dunya": "Globe" as const,
  "Quran Memorization": "Book" as const,
  "Women in Islam": "Crown" as const,
}

// Color mapping for deck icons
const deckColorMap = {
  Aqeedah: "bg-blue-100",
  Fiqh: "bg-green-100",
  "Tazkiyah & Ihsan": "bg-red-100",
  History: "bg-purple-100",
  "Hadith & Sahaba": "bg-yellow-100",
  Bidah: "bg-orange-100",
  "Akhlaq & Adab": "bg-pink-100",
  "Deen in Modern Dunya": "bg-indigo-100",
  "Quran Memorization": "bg-teal-100",
  "Women in Islam": "bg-cyan-100",
}

function getDailyPracticeProgress() {
  const today = new Date().toISOString().split("T")[0]
  const stored = localStorage.getItem(`daily-practice-${today}`)
  if (!stored) return 0
  const progress = JSON.parse(stored)
  return Math.round((progress.completed / progress.total) * 100)
}

export default function HomePage() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [percent, setPercent] = useState(0)

  const refreshProgress = () => {
    const key = `dailySet-${new Date().toISOString().slice(0, 10)}-progress`
    const p = Number(localStorage.getItem(key) || "0")
    setPercent(Math.round((p / 10) * 100))
  }

  useEffect(() => {
    refreshProgress()
  }, [])

  useEffect(() => {
    async function loadDecks() {
      try {
        console.log("[v0] Starting to load decks...")
        const fetchedDecks = await fetchAllDecks()
        const userProgress = getUserProgress()

        const decksWithProgress = fetchedDecks.map((deck) => {
          const progress = userProgress.find((p) => p.deckId === deck.id)
          return {
            ...deck,
            progress: progress ? Math.round((progress.completedCards / progress.totalCards) * 100) : 0,
          }
        })

        console.log("[v0] Successfully loaded decks:", decksWithProgress.length)
        setDecks(decksWithProgress)
      } catch (error) {
        console.error("[v0] Error loading decks:", error)
        setDecks([])
      } finally {
        setLoading(false)
      }
    }

    loadDecks()

    const onStorage = () => refreshProgress()
    const onProgress = () => refreshProgress()
    window.addEventListener("storage", onStorage)
    window.addEventListener("progress-updated", onProgress as EventListener)

    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("progress-updated", onProgress as EventListener)
    }
  }, [])

  const filteredDecks = decks.filter((deck) => deck.name.toLowerCase().includes(searchQuery.toLowerCase()))

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading flashcards...</p>
        </div>
      </div>
    )
  }

  if (decks.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Flashcards</h2>
          <p className="text-gray-600 mb-4">
            The Google Sheet needs to be publicly accessible. Please make sure the sheet is shared with "Anyone with the
            link can view".
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-25 via-emerald-25 to-teal-50">
      <Navigation />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <section className="my-6">
          <div className="rounded-2xl bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 p-6 text-white shadow-lg">
            <h2 className="text-lg font-semibold">Daily Practice</h2>
            <p className="text-sm">Practice with 10 random cards from all decks</p>
            <Link href="/daily-practice">
              <button className="mt-4 rounded-full bg-white text-teal-600 px-4 py-2 shadow">Start Practice</button>
            </Link>
            <div className="mt-3 h-2 rounded bg-white/50 overflow-hidden">
              <div className="h-full bg-teal-700" style={{ width: `${percent}%` }} />
            </div>
            <div className="mt-1 text-sm">{percent}% today</div>
          </div>
        </section>

        <section className="my-6">
          <h2 className="text-2xl font-bold">Choose Your Deck</h2>
          <p className="text-gray-600 mb-6">Select a topic to start learning</p>

          <div className="relative max-w-md mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search decks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white text-gray-900 border rounded-full"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {filteredDecks.map((deck) => (
              <DeckCard
                key={deck.id}
                icon={deckIconMap[deck.name as keyof typeof deckIconMap] || "book"}
                color={deckColorMap[deck.name as keyof typeof deckColorMap] || "bg-gray-100"}
                name={deck.name}
                cardsCount={deck.cards.length}
                progress={deck.progress}
                href={`/deck/${deck.id}`}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
