export type GuestProgress = {
  // deckId bazlı yüzde ya da sayaç gibi basit değerler
  [deckId: string]: { correct: number; total: number }
}

const SAVED_KEY = "ikc_guest_saved" // string[] of card ids
const PROG_KEY = "ikc_guest_progress" // GuestProgress

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export function getGuestSaved(): string[] {
  return readJSON<string[]>(SAVED_KEY, [])
}

export function toggleGuestSaved(cardId: string): string[] {
  const saved = new Set(getGuestSaved())
  if (saved.has(cardId)) saved.delete(cardId)
  else saved.add(cardId)
  const arr = Array.from(saved)
  writeJSON(SAVED_KEY, arr)
  return arr
}

export function isGuestSaved(cardId: string): boolean {
  return getGuestSaved().includes(cardId)
}

export function getGuestProgress(): GuestProgress {
  return readJSON<GuestProgress>(PROG_KEY, {})
}

export function bumpGuestProgress(deckId: string, correct: boolean) {
  const prog = getGuestProgress()
  const cur = prog[deckId] || { correct: 0, total: 0 }
  prog[deckId] = { correct: cur.correct + (correct ? 1 : 0), total: cur.total + 1 }
  writeJSON(PROG_KEY, prog)
  return prog[deckId]
}

export function setGuestProgress(deckId: string, correct: number, total: number) {
  const prog = getGuestProgress()
  prog[deckId] = { correct, total }
  writeJSON(PROG_KEY, prog)
}

export function clearGuestData() {
  if (typeof window === "undefined") return
  localStorage.removeItem(SAVED_KEY)
  localStorage.removeItem(PROG_KEY)
}
