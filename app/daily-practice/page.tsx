"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { fetchAllDecks } from "@/lib/google-sheets"
import GameCard from "@/components/game-card"
import type { FlashcardData } from "@/types/flashcard"

function getTodayKey() {
  return new Date().toISOString().split("T")[0]
}

function getDailyProgress() {
  const today = getTodayKey()
  const stored = localStorage.getItem(`daily-practice-${today}`)
  return stored ? JSON.parse(stored) : { completed: 0, total: 10, finished: false }
}

function saveDailyProgress(completed: number, finished = false) {
  const today = getTodayKey()
  const progress = { completed, total: 10, finished }
  localStorage.setItem(`daily-practice-${today}`, JSON.stringify(progress))
}

export default function DailyPracticePage() {
  const router = useRouter()
  const [cards, setCards] = useState<FlashcardData[]>([])
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    async function loadDailyCards() {
      try {
        const dailyProgress = getDailyProgress()
        if (dailyProgress.finished) {
          setCompleted(true)
          setLoading(false)
          return
        }

        const decks = await fetchAllDecks()
        const allCards = decks.flatMap((deck) =>
          deck.cards.map((card) => ({
            ...card,
            deckName: deck.name,
            slug: deck.name, // Add original deck slug for save navigation
          })),
        )

        // Shuffle and take 10 random cards
        const shuffled = allCards.sort(() => Math.random() - 0.5)
        const dailyCards = shuffled.slice(0, 10)

        setCards(dailyCards)
      } catch (error) {
        console.error("Error loading daily practice cards:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDailyCards()
  }, [])

  const handleBack = () => {
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading daily practice...</div>
      </div>
    )
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-400 to-teal-600">
        <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
            <Button onClick={() => router.push("/")} variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <Card className="max-w-md mx-auto bg-white">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold mb-2">Daily Practice Complete!</h2>
              <p className="text-gray-600 mb-6">Great job! You've completed today's 10 practice cards.</p>
              <Button
                onClick={() => {
                  const today = getTodayKey()
                  localStorage.removeItem(`daily-practice-${today}`)
                  window.location.reload()
                }}
                className="bg-teal-500 hover:bg-teal-600"
              >
                Practice Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
        <Card className="max-w-md mx-auto bg-white">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold mb-2">No Cards Available</h2>
            <p className="text-gray-600">Unable to load practice cards. Please check your connection.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const gameCards = cards.map((card) => ({
    question: card.question,
    answerA: card.answerA,
    answerB: card.answerB,
    explanationA: card.explanationA,
    explanationB: card.explanationB,
    correct: card.correct,
    section: card.deckName,
    slug: card.slug, // Include original deck slug for navigation back to specific deck
  }))

  return <GameCard cards={gameCards} deckSlug="daily" onBack={handleBack} />
}
