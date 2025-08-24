export function deckKey(slug: string) {
  return `deckProgress:${slug}`
}

export function markDeckViewed(slug: string, cardId: string) {
  const key = deckKey(slug)
  const set = new Set<string>(JSON.parse(localStorage.getItem(key) || "[]"))
  set.add(cardId)
  localStorage.setItem(key, JSON.stringify(Array.from(set)))
}

export function getDeckPercent(slug: string, total: number) {
  const key = deckKey(slug)
  const arr = JSON.parse(localStorage.getItem(key) || "[]")
  const seen = Array.isArray(arr) ? arr.length : 0
  if (!total) return 0
  return Math.min(100, Math.round((seen / total) * 100))
}

export function dailyBase() {
  return `dailySet:${new Date().toISOString().slice(0, 10)}`
}

export function markDailyViewed(cardUid: string) {
  const key = `${dailyBase()}:viewed`
  const set = new Set<string>(JSON.parse(localStorage.getItem(key) || "[]"))
  set.add(cardUid)
  localStorage.setItem(key, JSON.stringify(Array.from(set)))
  return set.size
}

export function getDailyPercent(total = 10) {
  const key = `${dailyBase()}:viewed`
  const arr = JSON.parse(localStorage.getItem(key) || "[]")
  const seen = Array.isArray(arr) ? arr.length : 0
  return Math.min(100, Math.round((seen / total) * 100))
}
