"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bookmark, MessageSquare } from "lucide-react"
import { toggleBookmark, getUserNotes } from "@/lib/storage"
import { NotesDialog } from "@/components/notes-dialog"
import type { Card as FlashCardType } from "@/types/flashcard"

interface FlashCardProps {
  card: FlashCardType
  onAnswerSelect: (answer: "A" | "B") => void
  deckId?: string
  cardIndex?: number
}

export function FlashCard({ card, onAnswerSelect, deckId, cardIndex }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<"A" | "B" | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showNotesDialog, setShowNotesDialog] = useState(false)

  const handleAnswerClick = (answer: "A" | "B") => {
    setSelectedAnswer(answer)
    setIsFlipped(true)
    onAnswerSelect(answer)
  }

  const handleBookmarkToggle = () => {
    if (deckId !== undefined && cardIndex !== undefined) {
      const bookmarked = toggleBookmark(deckId, cardIndex)
      setIsBookmarked(bookmarked)
    }
  }

  const hasNote =
    deckId !== undefined &&
    cardIndex !== undefined &&
    getUserNotes().some((note) => note.deckId === deckId && note.cardIndex === cardIndex)

  return (
    <div className="perspective-1000 w-full max-w-4xl mx-auto">
      <div className={`flashcard-container ${isFlipped ? "flipped" : ""}`}>
        {/* Front of card */}
        <Card className="flashcard-front absolute w-full h-full backface-hidden">
          <CardContent className="p-8 h-full flex flex-col">
            {/* Card actions */}
            {deckId !== undefined && cardIndex !== undefined && (
              <div className="flex justify-end gap-2 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBookmarkToggle}
                  className={isBookmarked ? "text-yellow-500" : ""}
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotesDialog(true)}
                  className={hasNote ? "text-blue-500" : ""}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Question */}
            <div className="flex-1 flex items-center justify-center text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-relaxed">{card.question}</h2>
            </div>

            {/* Answer options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Button
                variant="outline"
                size="lg"
                className="h-20 text-lg font-semibold hover:scale-105 transition-transform bg-transparent"
                onClick={() => handleAnswerClick("A")}
              >
                {card.answerA}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-20 text-lg font-semibold hover:scale-105 transition-transform bg-transparent"
                onClick={() => handleAnswerClick("B")}
              >
                {card.answerB}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Back of card */}
        <Card className="flashcard-back absolute w-full h-full backface-hidden rotate-y-180">
          <CardContent className="p-8 h-full flex flex-col">
            {/* Selected answer indicator */}
            {selectedAnswer && (
              <div className="flex justify-center mb-6">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  You selected: {selectedAnswer === "A" ? card.answerA : card.answerB}
                </Badge>
              </div>
            )}

            {/* Explanations */}
            <div className="flex-1 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-semibold">
                    {card.answerA}
                  </Badge>
                </div>
                <p className="text-foreground leading-relaxed">{card.explanationA}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-semibold">
                    {card.answerB}
                  </Badge>
                </div>
                <p className="text-foreground leading-relaxed">{card.explanationB}</p>
              </div>
            </div>

            {/* Flip back button */}
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsFlipped(false)
                  setSelectedAnswer(null)
                }}
              >
                View Question Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes Dialog */}
      {deckId !== undefined && cardIndex !== undefined && (
        <NotesDialog open={showNotesDialog} onOpenChange={setShowNotesDialog} deckId={deckId} cardIndex={cardIndex} />
      )}
    </div>
  )
}
