import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Star,
  Scale,
  Heart,
  Clock,
  Book,
  Gavel,
  Sparkles,
  Globe,
  Users,
  AlertTriangle,
  Smile,
  Smartphone,
  BookOpen,
  Crown,
} from "lucide-react"

const iconMap = {
  Star,
  Scale,
  Heart,
  Clock,
  Book,
  Gavel,
  Sparkles,
  Globe,
  Users,
  AlertTriangle,
  Smile,
  Smartphone,
  BookOpen,
  Crown,
} as const

interface DeckCardProps {
  icon: keyof typeof iconMap
  color: string
  name: string
  cardsCount: number
  progress: number
  href: string
}

export function DeckCard({ icon, color, name, cardsCount, progress, href }: DeckCardProps) {
  const IconComponent = iconMap[icon]

  return (
    <Link href={href}>
      <Card className="rounded-2xl hover:shadow-md transition-all duration-200 cursor-pointer group shadow-md bg-transparent">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Icon */}
            <div
              className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center group-hover:scale-105 transition-transform`}
            >
              <IconComponent className="w-8 h-8 text-gray-700" />
            </div>

            {/* Deck Name */}
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{name}</h3>
              <p className="text-sm text-gray-500">{cardsCount} cards</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-gray-100" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
