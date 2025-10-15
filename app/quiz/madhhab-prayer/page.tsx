"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import quizData from "@/data/quizzes/madhhab-prayer.json"

type Scores = {
  hanafi: number
  maliki: number
  shafii: number
  hanbali: number
}

export default function MadhabPrayerQuiz() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({})
  const [scores, setScores] = useState<Scores>({ hanafi: 0, maliki: 0, shafii: 0, hanbali: 0 })
  const [showResults, setShowResults] = useState(false)

  const question = quizData.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100

  const handleSelectAnswer = (optionId: string) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: optionId })
  }

  const handleNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    // Calculate scores
    const newScores: Scores = { hanafi: 0, maliki: 0, shafii: 0, hanbali: 0 }

    quizData.questions.forEach((q, index) => {
      const selectedOptionId = selectedAnswers[index]
      if (selectedOptionId) {
        const option = q.options.find((opt) => opt.id === selectedOptionId)
        if (option) {
          newScores.hanafi += option.scores.hanafi
          newScores.maliki += option.scores.maliki
          newScores.shafii += option.scores.shafii
          newScores.hanbali += option.scores.hanbali
        }
      }
    })

    setScores(newScores)
    setShowResults(true)
  }

  const handleRetake = () => {
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setScores({ hanafi: 0, maliki: 0, shafii: 0, hanbali: 0 })
    setShowResults(false)
  }

  if (showResults) {
    const total = scores.hanafi + scores.maliki + scores.shafii + scores.hanbali
    const percentages = {
      hanafi: total > 0 ? Math.round((scores.hanafi / total) * 100) : 0,
      maliki: total > 0 ? Math.round((scores.maliki / total) * 100) : 0,
      shafii: total > 0 ? Math.round((scores.shafii / total) * 100) : 0,
      hanbali: total > 0 ? Math.round((scores.hanbali / total) * 100) : 0,
    }

    const sortedMadhhabs = Object.entries(percentages).sort(([, a], [, b]) => b - a)

    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-400 to-teal-600 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl bg-white p-6 sm:p-8 border-2 border-teal-200 shadow-lg font-sans">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{quizData.title}</h1>
            <h2 className="text-xl sm:text-2xl font-bold text-teal-600 mb-6">Your Results</h2>

            <div className="space-y-6 mb-8">
              {sortedMadhhabs.map(([madhhab, percentage]) => (
                <div key={madhhab}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold text-gray-900 capitalize">{madhhab}</span>
                    <span className="text-lg font-bold text-teal-600">{percentage}%</span>
                  </div>
                  <div className="h-4 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Your Prayer Style</h3>
              <p className="text-gray-700">
                Based on your answers, your prayer practices align most closely with the{" "}
                <span className="font-bold capitalize">{sortedMadhhabs[0][0]}</span> madhhab ({sortedMadhhabs[0][1]}%).
                Remember that all four madhhabs are valid schools of Islamic jurisprudence, and following any of them is
                acceptable.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleRetake}
                className="flex-1 px-6 py-3 rounded-full bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors"
              >
                Retake Quiz
              </button>
              <Link href="/" className="flex-1">
                <button className="w-full px-6 py-3 rounded-full bg-gray-100 text-gray-900 font-medium hover:bg-gray-200 transition-colors">
                  Back to Home
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isLastQuestion = currentQuestion === quizData.questions.length - 1
  const hasSelectedAnswer = selectedAnswers[currentQuestion] !== undefined

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-teal-400 to-teal-600 py-8 px-4">
      <div className="absolute left-2 sm:left-4 top-2 sm:top-4 z-20">
        <button
          aria-label="Back to Home"
          onClick={() => router.push("/")}
          className="h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur flex items-center justify-center shadow"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </button>
      </div>

      <div className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 z-20">
        <span className="px-3 sm:px-4 py-1 rounded-full bg-white/25 text-white text-xs sm:text-sm font-semibold backdrop-blur font-sans">
          Question {currentQuestion + 1} of {quizData.questions.length}
        </span>
      </div>

      <div className="max-w-3xl mx-auto pt-16 sm:pt-12">
        <div className="rounded-3xl bg-white p-6 sm:p-8 border-2 border-teal-200 shadow-lg font-sans">
          <div className="mb-6">
            <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">{question.text}</h2>

            <div className="space-y-3">
              {question.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelectAnswer(option.id)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    selectedAnswers[currentQuestion] === option.id
                      ? "border-teal-500 bg-gradient-to-br from-teal-50 to-cyan-50"
                      : "border-gray-200 bg-white hover:border-teal-200"
                  }`}
                >
                  <span className="text-gray-900">{option.text}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="h-11 sm:h-12 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm sm:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-teal-700"
            >
              Back
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={!hasSelectedAnswer}
                className="h-11 sm:h-12 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm sm:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-teal-700"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!hasSelectedAnswer}
                className="h-11 sm:h-12 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm sm:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-teal-700"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
