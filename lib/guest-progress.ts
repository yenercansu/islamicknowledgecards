// lib/guest-progress.ts
export type DeckProgress = { correct: number; total: number }
export type ProgressMap = Record<string, DeckProgress>

const KEY = "ikc_progress_v1"

function read<T>(fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write<T>(value: T) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(KEY, JSON.stringify(value))
  } catch {}
}

export function getAllProgress(): ProgressMap {
  return read<ProgressMap>({})
}

export function getDeckProgress(deckId: string): DeckProgress {
  const all = getAllProgress()
  return all[deckId] || { correct: 0, total: 0 }
}

export function bumpProgress(deckId: string, wasCorrect: boolean): DeckProgress {
  const all = getAllProgress()
  const cur = all[deckId] || { correct: 0, total: 0 }
  const next = {
    correct: cur.correct + (wasCorrect ? 1 : 0),
    total: cur.total + 1,
  }
  all[deckId] = next
  write(all)
  return next
}

export function setDeckProgress(deckId: string, correct: number, total: number) {
  const all = getAllProgress()
  all[deckId] = { correct, total }
  write(all)
}

export function clearAllProgress() {
  if (typeof window === "undefined") return
  localStorage.removeItem(KEY)
}
