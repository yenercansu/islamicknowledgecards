import Link from "next/link"
import { ChevronRight, FileText } from "lucide-react"

interface DeckCardProps {
  name: string
  cardsCount: number
  progress: number
  href: string
}

export function DeckCard({ name, cardsCount, progress, href }: DeckCardProps) {
  return (
    <Link href={href}>
      <div className="rounded-2xl bg-white border-teal-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group border-2">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{name}</h3>
              <p className="text-sm text-gray-600">{cardsCount} cards</p>
            </div>
          </div>

          <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-teal-600 transition-colors" />
        </div>

        <div className="mt-4">
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full bg-gray-900 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-2 text-sm font-medium text-gray-700">{progress}%</div>
        </div>
      </div>
    </Link>
  )
}
