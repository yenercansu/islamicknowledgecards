"use client"
import { useEffect, useState } from "react"
import { markDeckViewed, markDailyViewed } from "@/lib/progress"
import { toggleSaved, isSaved } from "@/lib/saved"

export type Card = {
  question: string
  answerA: string
  answerB: string
  explanationA: string
  explanationB: string
  correct: "A" | "B"
  section?: string // optional deck label for the tag
  slug?: string // added slug property for tracking original deck
}

export default function GameCard({
  cards,
  deckSlug,
  getCardId,
  onBack,
  onNext,
  onPrev,
  onRandom,
  initialIndex = 0, // added initialIndex prop with default value
}: {
  cards: Card[]
  deckSlug?: string // used for deck progress keys
  getCardId?: (c: Card, i: number) => string // unique id for progress and saved
  onBack: () => void
  onNext?: () => void
  onPrev?: () => void
  onRandom?: () => void
  initialIndex?: number // added initialIndex prop type
}) {
  const [index, setIndex] = useState(initialIndex) // initialize with initialIndex
  const [selected, setSelected] = useState<"A" | "B" | null>(null)
  const [flipped, setFlipped] = useState(false)
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})
  const [toast, setToast] = useState<string | null>(null)

  const total = cards.length
  const card = cards[index]

  useEffect(() => {
    setIndex(initialIndex) // reset to initialIndex when cards or initialIndex changes
    setSelected(null)
    setFlipped(false)
    setRevealed({})
  }, [cards, initialIndex]) // added initialIndex to dependency array

  const uid = getCardId ? getCardId(card, index) : `${deckSlug || "deck"}:${index}`

  const [saved, setSaved] = useState(false)
  useEffect(() => setSaved(isSaved(uid)), [uid])

  const isCorrect = selected && selected === card.correct

  const notifyProgress = () => {
    window.dispatchEvent(new Event("progress-updated"))
  }

  const markFirstProgressForThisCard = () => {
    if (revealed[index]) return
    if (deckSlug) markDeckViewed(deckSlug, uid)
    markDailyViewed(uid)
    setRevealed((prev) => ({ ...prev, [index]: true }))
    notifyProgress()
  }

  const handleAnyClick = () => {
    if (!flipped) markFirstProgressForThisCard()
  }

  const choose = (c: "A" | "B") => {
    if (flipped) return
    setSelected(c)
    setTimeout(() => setFlipped(true), 140)
  }

  const goNext = () => {
    onNext?.()
    setSelected(null)
    setFlipped(false)
    setIndex((i) => Math.min(total - 1, i + 1))
  }

  const goPrev = () => {
    onPrev?.()
    setSelected(null)
    setFlipped(false)
    setIndex((i) => Math.max(0, i - 1))
  }

  const goRandom = () => {
    onRandom?.()
    const i = Math.floor(Math.random() * total)
    setSelected(null)
    setFlipped(false)
    setIndex(i)
    setToast(`Jumped to question ${i + 1}`)
    setTimeout(() => setToast(null), 1200)
  }

  const onSave = () => {
    const theSlug = (card as any).slug || deckSlug
    toggleSaved(uid, {
      question: card.question,
      section: card.section || theSlug,
      slug: theSlug, // added slug to saved data for navigation
      index,
    })
    setSaved(isSaved(uid))
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-teal-300 via-teal-400 to-teal-500">
      {/* top left: back arrow + deck tag */}
      <div className="absolute left-4 top-4 z-20 flex items-center gap-2">
        <button
          aria-label="Back"
          onClick={onBack}
          className="h-11 w-11 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur flex items-center justify-center shadow"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white">
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {card.section && (
          <span className="px-3 py-1 rounded-full bg-white/25 text-white text-sm font-semibold backdrop-blur">
            {card.section}
          </span>
        )}
      </div>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <span className="px-4 py-1 rounded-full bg-white/25 text-white text-sm font-semibold backdrop-blur">
          Question {Math.min(index + 1, total)} of {total || 0}
        </span>
      </div>

      <button
        onClick={onSave}
        aria-label="Save"
        className="absolute top-4 right-4 z-20 h-10 w-10 rounded-full hover:bg-white/20 grid place-items-center"
        title={saved ? "Saved" : "Save"}
      >
        {saved ? (
          <svg width="18" height="18" viewBox="0 0 24 24" className="text-teal-700" fill="currentColor">
            <path d="M6 2h12v20l-6-4-6 4V2z" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" className="text-teal-700" fill="none">
            <path d="M6 2h12v20l-6-4-6 4V2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* card wrapper */}
      <div className="flex items-center justify-center px-4 pt-16 pb-28">
        <style>{`
          .perspective { perspective: 1200px; }
          .preserve-3d { transform-style: preserve-3d; }
          .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        `}</style>

        <div className="perspective w-full max-w-[920px]">
          <div
            className="relative preserve-3d rounded-3xl transition-transform duration-300 mx-auto"
            style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)", height: "min(70vh, 78dvh)" }}
            onClick={() => {
              if (flipped) {
                setFlipped(false) // only allow click-to-flip if it's already the back
              }
            }}
          >
            {/* FRONT — spacious layout */}
            <div
              className={`absolute inset-0 backface-hidden rounded-3xl border ${isCorrect ? "border-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.5)]" : "border-black/10"} bg-white shadow-xl p-12 md:p-14 text-slate-900`}
              onClick={handleAnyClick}
            >
              <div className="h-full w-full mx-auto max-w-[1000px] flex flex-col">
                {/* Question */}
                <div className="flex-1 flex items-center justify-center">
                  <h1 className="text-center font-extrabold text-3xl md:text-4xl lg:text-5xl leading-[1.25] md:leading-[1.2] tracking-tight">
                    {card.question}
                  </h1>
                </div>

                {/* Divider */}
                <div className="mx-auto mt-4 mb-8 h-1 w-[72%] bg-teal-600 rounded-full" />

                {/* Answers row */}
                <div className="mb-2 grid grid-cols-[1fr_auto_1fr] items-center gap-8 md:gap-12 max-w-[900px] mx-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      choose("A")
                    }}
                    className={`py-5 border-2 ${
                      selected === "A" ? "bg-green-50 border-green-200" : "bg-white hover:bg-teal-50"
                    } text-black font-semibold text-lg md:text-xl border-transparent rounded-3xl w-[110%] px-[30px]`}
                  >
                    {card.answerA}
                  </button>

                  <span className="text-teal-700 font-semibold select-none text-lg md:text-xl">or</span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      choose("B")
                    }}
                    className={`py-5 border-2 ${
                      selected === "B" ? "bg-green-50 border-green-200" : "bg-white hover:bg-teal-50"
                    } text-black font-semibold text-lg md:text-xl border-transparent rounded-3xl w-[110%] px-[30px]`}
                  >
                    {card.answerB}
                  </button>
                </div>
              </div>
            </div>

            {/* BACK */}
            <div
              className={`absolute inset-0 backface-hidden rounded-3xl border ${isCorrect ? "border-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.5)]" : "border-black/10"} bg-white shadow-xl p-10 text-slate-900`}
              style={{ transform: "rotateY(180deg)" }}
            >
              <div className="h-full grid grid-cols-1 md:grid-cols-[1fr_3px_1fr] gap-8 items-center text-center">
                <div className="p-6">
                  <div className="text-base font-bold mb-2">Answer A</div>
                  <div className="text-lg leading-relaxed">{card.explanationA}</div>
                </div>
                <div className="hidden md:block h-full w-[3px] bg-teal-600 rounded-full" />
                <div className="p-6">
                  <div className="text-base font-bold mb-2">Answer B</div>
                  <div className="text-lg leading-relaxed">{card.explanationB}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 left-0 right-0 px-4">
        <div className="grid grid-cols-3 gap-3 max-w-[920px] mx-auto">
          <button
            onClick={goPrev}
            className="h-12 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur text-white font-semibold"
          >
            Back
          </button>

          <button
            onClick={goRandom}
            className="h-12 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur text-white font-semibold flex items-center justify-center gap-2"
            aria-label="Randomize"
            title="Randomize question"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
              <path
                d="M4 4h4l3 4 3-4h6M4 20h4l3-4 3 4h6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Randomize
          </button>

          <button
            onClick={goNext}
            className="h-12 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur text-white font-semibold"
          >
            Next
          </button>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 px-3 py-2 rounded-full bg-black/70 text-white text-sm">
          {toast}
        </div>
      )}
    </div>
  )
}

export { GameCard }
