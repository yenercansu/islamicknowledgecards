// örnek: components/card-runner.tsx
"use client"
import { useState } from "react"
import { bumpProgress, getDeckProgress } from "@/lib/guest-progress"

export default function CardRunner({ deckId }: { deckId: string }) {
  const [stat, setStat] = useState(() => getDeckProgress(deckId))

  const onAnswer = (wasCorrect: boolean) => {
    const next = bumpProgress(deckId, wasCorrect)
    setStat(next)
  }

  return (
    <div>
      <p className="text-sm text-gray-600">
        Progress. {stat.correct} correct of {stat.total}
      </p>

      {/* örnek butonlar */}
      <div className="mt-3 flex gap-2">
        <button className="border px-3 py-1.5 rounded" onClick={() => onAnswer(true)}>
          I was right
        </button>
        <button className="border px-3 py-1.5 rounded" onClick={() => onAnswer(false)}>
          I was wrong
        </button>
      </div>
    </div>
  )
}
