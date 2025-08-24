export interface FlashcardData {
  question: string
  answerA: string
  answerB: string
  explanationA: string
  explanationB: string
  kategori?: string // Only for Bidah deck
}

export interface Deck {
  id: string
  name: string
  icon: string
  cards: FlashcardData[]
  progress: number // 0-100
}

export interface UserProgress {
  deckId: string
  completedCards: number
  totalCards: number
  lastStudied: Date
}

export interface Bookmark {
  deckId: string
  cardIndex: number
  dateAdded: Date
}

export interface UserNote {
  deckId: string
  cardIndex: number
  note: string
  dateCreated: Date
  dateModified: Date
}

export interface AppSettings {
  darkMode: boolean
  language: "EN" | "TR"
  autoShowExplanations: boolean
}

export interface DailyPractice {
  date: string // YYYY-MM-DD
  cards: Array<{
    deckId: string
    cardIndex: number
  }>
  completed: boolean
}
