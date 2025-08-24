import type { UserProgress, Bookmark, UserNote, AppSettings, DailyPractice } from "@/types/flashcard"

const STORAGE_KEYS = {
  PROGRESS: "flashcard_progress",
  BOOKMARKS: "flashcard_bookmarks",
  NOTES: "flashcard_notes",
  SETTINGS: "flashcard_settings",
  DAILY_PRACTICE: "flashcard_daily_practice",
} as const

// Progress Management
export function getUserProgress(): UserProgress[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS)
  return stored ? JSON.parse(stored) : []
}

export function updateUserProgress(deckId: string, completedCards: number, totalCards: number) {
  const progress = getUserProgress()
  const existingIndex = progress.findIndex((p) => p.deckId === deckId)

  const updatedProgress = {
    deckId,
    completedCards,
    totalCards,
    lastStudied: new Date(),
  }

  if (existingIndex >= 0) {
    progress[existingIndex] = updatedProgress
  } else {
    progress.push(updatedProgress)
  }

  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress))
}

// Bookmarks Management
export function getBookmarks(): Bookmark[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEYS.BOOKMARKS)
  return stored ? JSON.parse(stored) : []
}

export function toggleBookmark(deckId: string, cardIndex: number): boolean {
  const bookmarks = getBookmarks()
  const existingIndex = bookmarks.findIndex((b) => b.deckId === deckId && b.cardIndex === cardIndex)

  if (existingIndex >= 0) {
    bookmarks.splice(existingIndex, 1)
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks))
    return false // Removed bookmark
  } else {
    bookmarks.push({
      deckId,
      cardIndex,
      dateAdded: new Date(),
    })
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks))
    return true // Added bookmark
  }
}

// Notes Management
export function getUserNotes(): UserNote[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEYS.NOTES)
  return stored ? JSON.parse(stored) : []
}

export function saveUserNote(deckId: string, cardIndex: number, note: string) {
  const notes = getUserNotes()
  const existingIndex = notes.findIndex((n) => n.deckId === deckId && n.cardIndex === cardIndex)

  const now = new Date()

  if (existingIndex >= 0) {
    notes[existingIndex] = {
      ...notes[existingIndex],
      note,
      dateModified: now,
    }
  } else {
    notes.push({
      deckId,
      cardIndex,
      note,
      dateCreated: now,
      dateModified: now,
    })
  }

  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes))
}

// Settings Management
export function getAppSettings(): AppSettings {
  if (typeof window === "undefined") {
    return {
      darkMode: false,
      language: "EN",
      autoShowExplanations: false,
    }
  }

  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS)
  const defaultSettings: AppSettings = {
    darkMode: false,
    language: "EN",
    autoShowExplanations: false,
  }

  return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings
}

export function updateAppSettings(settings: Partial<AppSettings>) {
  const currentSettings = getAppSettings()
  const newSettings = { ...currentSettings, ...settings }
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings))
}

export function saveAppSettings(settings: AppSettings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
}

// Daily Practice Management
export function getTodaysPractice(): DailyPractice | null {
  if (typeof window === "undefined") return null
  const today = new Date().toISOString().split("T")[0]
  const stored = localStorage.getItem(STORAGE_KEYS.DAILY_PRACTICE)
  const practices: DailyPractice[] = stored ? JSON.parse(stored) : []

  return practices.find((p) => p.date === today) || null
}

export function generateDailyPractice(allDecks: any[]): DailyPractice {
  const today = new Date().toISOString().split("T")[0]
  const cards: Array<{ deckId: string; cardIndex: number }> = []

  // Get 10 random cards across all decks
  for (let i = 0; i < 10; i++) {
    const randomDeck = allDecks[Math.floor(Math.random() * allDecks.length)]
    if (randomDeck.cards.length > 0) {
      const randomCardIndex = Math.floor(Math.random() * randomDeck.cards.length)
      cards.push({
        deckId: randomDeck.id,
        cardIndex: randomCardIndex,
      })
    }
  }

  const practice: DailyPractice = {
    date: today,
    cards,
    completed: false,
  }

  // Save to storage
  const stored = localStorage.getItem(STORAGE_KEYS.DAILY_PRACTICE)
  const practices: DailyPractice[] = stored ? JSON.parse(stored) : []
  const existingIndex = practices.findIndex((p) => p.date === today)

  if (existingIndex >= 0) {
    practices[existingIndex] = practice
  } else {
    practices.push(practice)
  }

  localStorage.setItem(STORAGE_KEYS.DAILY_PRACTICE, JSON.stringify(practices))
  return practice
}
