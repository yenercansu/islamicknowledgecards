"use client"

import { useEffect, useState } from "react"
import { fetchAllDecks } from "@/lib/google-sheets"
import { getUserProgress } from "@/lib/storage"
import type { Deck } from "@/types/flashcard"
import Link from "next/link"
import { DeckCard } from "@/components/deck-card"
import { Star } from "lucide-react"

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
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-full bg-white text-teal-600 px-4 py-2 shadow"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="mx-auto max-w-7xl px-3 sm:px-6 py-4 sm:py-8 flex-1">
        <section className="mb-8 sm:mb-12">
          <div className="rounded-3xl bg-gradient-to-br from-teal-100 to-cyan-100 p-4 sm:p-8 border-teal-200 border-2 shadow-lg">
            <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-teal-700 fill-teal-700 border-[rgba(151,246,229,1)] flex-shrink-0" />
              <div>
                <h2 className="font-bold text-gray-900 font-sans text-xl sm:text-2xl">Daily Practice</h2>
                <p className="text-xs sm:text-sm text-gray-700 mt-1 font-sans">
                  Practice with 10 random cards from all decks
                </p>
              </div>
            </div>

            <Link href="/daily-practice">
              <button className="mt-3 sm:mt-4 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-teal-600 text-white text-xs sm:text-sm font-medium hover:bg-teal-700 transition-colors font-sans border-[10px] shadow-md border-[rgba(151,246,229,1)]">
                Start Practice
              </button>
            </Link>

            <div className="mt-4 sm:mt-6">
              <div className="h-2 rounded-full bg-white overflow-hidden">
                <div className="h-full bg-gray-900 transition-all duration-300" style={{ width: `${percent}%` }} />
              </div>
              <div className="mt-2 text-xs sm:text-sm font-medium text-gray-700 font-sans">Today {percent}%</div>
            </div>
          </div>
        </section>

        <section className="font-sans">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-sans">Choose Your Deck</h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1 font-sans">Select a topic to start learning</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {decks.map((deck) => (
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

        <section className="font-sans mt-12 sm:mt-16">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-sans">Choose Your Quiz</h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1 font-sans">
              Discover more about your beliefs, your mindset, and your understanding of Islam.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Quiz: According to Which Madhhab Are You Praying Correctly? */}
            <Link href="/quiz/madhhab-prayer" className="h-full">
              <div className="rounded-3xl bg-white p-6 border-2 border-teal-200 shadow-lg hover:shadow-xl transition-shadow flex flex-col cursor-pointer h-full">
                <div className="rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 p-4 mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    According to Which Madhhab Are You Praying Correctly?
                  </h3>
                </div>
                <p className="text-sm text-gray-700 mb-6 flex-grow">
                  Discover which school of Islamic jurisprudence your prayer practices align with most closely.
                </p>
                <button className="w-full px-6 py-2.5 rounded-full bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors mt-auto shadow-md border-[10px] border-[rgba(151,246,229,1)]">
                  Take the Quiz
                </button>
              </div>
            </Link>

            {/* Quiz: Which Sahabi Would Be Your Best Friend? */}
            <Link href="/quiz/sahabi-friend" className="h-full">
              <div className="rounded-3xl bg-white p-6 border-2 border-teal-200 shadow-lg hover:shadow-xl transition-shadow flex flex-col cursor-pointer h-full">
                <div className="rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 p-4 mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Which Sahabi Would Be Your Best Friend?</h3>
                </div>
                <p className="text-sm text-gray-700 mb-6 flex-grow">
                  Discover which Companion of the Prophet ﷺ reflects your character traits and values most closely.
                </p>
                <button className="w-full px-6 py-2.5 rounded-full bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors mt-auto shadow-md border-[10px] border-[rgba(151,246,229,1)]">
                  Take the Quiz
                </button>
              </div>
            </Link>

            {/* Quiz: Which Scholar Are You Closest To */}
            <Link href="/quiz/scholar-closest" className="h-full">
              <div className="rounded-3xl bg-white p-6 border-2 border-teal-200 shadow-lg hover:shadow-xl transition-shadow flex flex-col cursor-pointer h-full">
                <div className="rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 p-4 mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Which Scholar Are You Closest To</h3>
                </div>
                <p className="text-sm text-gray-700 mb-6 flex-grow">
                  Find the great Muslim thinker or scholar whose outlook and philosophy most resemble your own.
                </p>
                <button className="w-full px-6 py-2.5 rounded-full bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors mt-auto shadow-md border-[10px] border-[rgba(151,246,229,1)]">
                  Take the Quiz
                </button>
              </div>
            </Link>

            {/* Quiz: Which Madhhab Fits You Best */}
            <Link href="/quiz/madhhab-fit" className="h-full">
              <div className="rounded-3xl bg-white p-6 border-2 border-teal-200 shadow-lg hover:shadow-xl transition-shadow flex flex-col cursor-pointer h-full">
                <div className="rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 p-4 mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Which Madhhab Fits You Best</h3>
                </div>
                <p className="text-sm text-gray-700 mb-6 flex-grow">
                  Explore which school of Islamic law your approach to worship and daily life is closest to.
                </p>
                <button className="w-full px-6 py-2.5 rounded-full bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors mt-auto shadow-md border-[10px] border-[rgba(151,246,229,1)]">
                  Take the Quiz
                </button>
              </div>
            </Link>

            {/* Quiz: Ashari vs Maturidi vs Athari */}
            <Link href="/quiz/ashari-maturidi-athari" className="h-full">
              <div className="rounded-3xl bg-white p-6 border-2 border-teal-200 shadow-lg hover:shadow-xl transition-shadow flex flex-col cursor-pointer h-full">
                <div className="rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 p-4 mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Ashari vs Maturidi vs Athari</h3>
                </div>
                <p className="text-sm text-gray-700 mb-6 flex-grow">
                  Test your theological orientation and discover which Sunni creed school your beliefs align with most.
                </p>
                <button className="w-full px-6 py-2.5 rounded-full bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors mt-auto shadow-md border-[10px] border-[rgba(151,246,229,1)]">
                  Take the Quiz
                </button>
              </div>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">contact info</h3>
              <a
                href="mailto:info@islamicknowledgecards.com"
                className="text-sm text-gray-600 hover:text-teal-600 transition-colors"
              >
                info@islamicknowledgecards.com
              </a>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">instagram</h3>
              <a
                href="https://instagram.com/islamicknowledgecards"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-teal-600 transition-colors"
              >
                @islamicknowledgecards
              </a>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 text-right">
            <p className="text-xs text-gray-500">
              created by, Volunteers of <span className="font-semibold">Kim Vakfi: Farah &amp; Friends</span>
              <br />
              all rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
