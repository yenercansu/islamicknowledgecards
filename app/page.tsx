"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchAllDecks } from "@/lib/google-sheets"
import { getUserProgress } from "@/lib/storage"
import type { Deck } from "@/types/flashcard"
import Link from "next/link"
import { DeckCard } from "@/components/deck-card"
import { Search, Monitor, Settings } from "lucide-react"
import { AuthButton } from "@/components/auth-button"

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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Islamic Studies</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                <Monitor className="w-5 h-5 text-teal-600" />
              </Button>
              <Link href="/settings">
                <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                  <Settings className="w-5 h-5 text-teal-600" />
                </Button>
              </Link>
              <AuthButton />
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-1">
            <Button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-full">Home</Button>
            <Link href="/daily-practice">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900 px-6 py-2 rounded-full">
                Daily
              </Button>
            </Link>
            <Link href="/saved">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900 px-6 py-2 rounded-full">
                Saved
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-[-4px] sm:mx-0 mb-6 rounded-2xl shadow bg-gradient-to-br from-teal-200 to-teal-400 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">Daily Practice</h2>
              <p className="text-sm opacity-80">Practice with 10 random cards from all decks</p>
            </div>
            <Link href="/daily-practice" className="px-4 py-2 rounded-xl bg-white text-teal-700 font-semibold shadow">
              Start Practice
            </Link>
          </div>
          <div className="mt-3 h-2 rounded bg-white/50 overflow-hidden">
            <div className="h-full bg-teal-700" style={{ width: `${percent}%` }} />
          </div>
          <div className="mt-1 text-sm">{percent}% today</div>
        </div>

        <div className="bg-gradient-to-br from-teal-400 to-teal-600 rounded-3xl shadow-lg p-8 mb-8 text-white">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-2">Choose Your Deck</h2>
            <p className="text-teal-100 mb-6">Select a topic to start learning</p>

            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search decks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white text-gray-900 border-0 rounded-full"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
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
      </main>
    </div>
  )
}
