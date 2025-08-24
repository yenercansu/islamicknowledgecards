"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import GameCard from "@/components/game-card"
import type { FlashcardData } from "@/types/flashcard"
import { fetchDeckData } from "@/lib/google-sheets"

export default function DeckPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [cards, setCards] = useState<FlashcardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const deckName = params.slug as string
  const cardParam = searchParams.get("card")
  const fromParam = searchParams.get("from")

  useEffect(() => {
    const loadDeck = async () => {
      try {
        setLoading(true)
        const deckData = await fetchDeckData(deckName)
        setCards(deckData)
      } catch (err) {
        setError("Failed to load deck")
        console.error("Error loading deck:", err)
      } finally {
        setLoading(false)
      }
    }

    if (deckName) {
      loadDeck()
    }
  }, [deckName])

  const getCardId = (card: any, index: number) => `${deckName}:${card.question?.slice(0, 64) || index}`
  let initialIndex = 0
  if (cardParam && cards.length > 0) {
    const foundIndex = cards.findIndex((card, index) => getCardId(card, index) === cardParam)
    if (foundIndex >= 0) {
      initialIndex = foundIndex
    }
  }

  const handleBack = () => {
    if (fromParam === "saved") {
      router.push("/saved")
    } else {
      router.push("/")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading deck...</div>
      </div>
    )
  }

  if (error || cards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Deck not found</h2>
          <button onClick={() => router.push("/")} className="px-4 py-2 bg-white text-teal-600 rounded">
            Back to Home
          </button>
        </div>
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
    section: deckName,
    slug: deckName,
  }))

  return (
    <GameCard
      cards={gameCards}
      deckSlug={deckName}
      getCardId={getCardId}
      initialIndex={initialIndex}
      onBack={handleBack}
    />
  )
}
