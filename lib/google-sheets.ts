const SHEET_ID = "1eE2FmI9ccQ5tu5QNgQHy1hPNdt11rVV1"

export const DECK_CONFIGS = [
  { id: "aqeedah", name: "Aqeedah", icon: "☪️", sheetName: "Aqeedah" },
  { id: "fiqh", name: "Fiqh", icon: "⚖️", sheetName: "Fiqh" },
  { id: "tazkiyah", name: "Tazkiyah & Ihsan", icon: "❤️", sheetName: "Tazkiyah_Ihsan" },
  { id: "history", name: "History", icon: "🕐", sheetName: "History" },
  { id: "hadith", name: "Hadith & Sahaba", icon: "📖", sheetName: "Hadith_Sahaba" },
  { id: "bidah", name: "Bidah", icon: "⚠️", sheetName: "Bidah" },
  { id: "akhlaq", name: "Akhlaq & Adab", icon: "😊", sheetName: "Akhlaq_Adab" },
  { id: "dunya", name: "Deen in Modern Dunya", icon: "🌍", sheetName: "Deen_in_Modern_Dunya" },
  { id: "quran", name: "Quran Memorization", icon: "📕", sheetName: "Quran_Memorization" },
  { id: "women", name: "Women in Islam", icon: "⭐", sheetName: "Women_in_Islam" },
]

export async function fetchDeckData(sheetName: string) {
  try {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`

    console.log(`[v0] Fetching data from: ${csvUrl}`)

    const response = await fetch(csvUrl, {
      method: "GET",
      headers: {
        Accept: "text/csv",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const csvText = await response.text()
    console.log(`[v0] CSV response for ${sheetName}:`, csvText.substring(0, 200) + "...")

    const lines = csvText.split("\n").filter((line) => line.trim())
    if (lines.length === 0) {
      throw new Error("No data found in CSV")
    }

    // Parse CSV with proper quote handling
    const parseCSVLine = (line: string): string[] => {
      const result: string[] = []
      let current = ""
      let inQuotes = false

      for (let i = 0; i < line.length; i++) {
        const char = line[i]

        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"'
            i++ // Skip next quote
          } else {
            inQuotes = !inQuotes
          }
        } else if (char === "," && !inQuotes) {
          result.push(current.trim())
          current = ""
        } else {
          current += char
        }
      }

      result.push(current.trim())
      return result
    }

    const headers = parseCSVLine(lines[0])
    console.log(`[v0] Headers for ${sheetName}:`, headers)

    const cards = lines
      .slice(1)
      .map((line, index) => {
        try {
          const values = parseCSVLine(line)
          return {
            question: values[0] || "",
            answerA: values[1] || "",
            answerB: values[2] || "",
            explanationA: values[3] || "",
            explanationB: values[4] || "",
            kategori: values[5] || undefined, // Only for Bidah deck
          }
        } catch (error) {
          console.error(`[v0] Error parsing line ${index + 1}:`, error)
          return null
        }
      })
      .filter((card): card is NonNullable<typeof card> => card !== null && !!card.question)

    console.log(`[v0] Parsed ${cards.length} cards for ${sheetName}`)
    return cards
  } catch (error) {
    console.error(`Error fetching data for ${sheetName}:`, error)
    throw error
  }
}

export async function fetchAllDecks() {
  const decks = await Promise.all(
    DECK_CONFIGS.map(async (config) => {
      const cards = await fetchDeckData(config.sheetName)
      return {
        ...config,
        cards,
        progress: 0, // Will be calculated based on user progress
      }
    }),
  )

  return decks
}
