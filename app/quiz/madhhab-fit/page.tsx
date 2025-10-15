"use client"

import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import quizData from "@/data/quizzes/madhhab-fit.json"

type Scores = {
  [key: string]: number
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function MadhhabFitQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [scores, setScores] = useState<Scores>({
    Hanafi: 0,
    Maliki: 0,
    "Shafi'i": 0,
    Hanbali: 0,
  })
  const [showResults, setShowResults] = useState(false)
  const [shuffledQuestions, setShuffledQuestions] = useState(quizData.questions)

  useEffect(() => {
    const questionsWithShuffledOptions = quizData.questions.map((question) => ({
      ...question,
      options: shuffleArray(question.options),
    }))
    setShuffledQuestions(questionsWithShuffledOptions)
  }, [])

  const handleOptionSelect = (optionId: string) => {
    setSelectedOptions([optionId])
  }

  const handleNext = () => {
    if (selectedOptions.length === 0) return

    const currentQ = shuffledQuestions[currentQuestion]
    const newScores = { ...scores }

    selectedOptions.forEach((optionId) => {
      const option = currentQ.options.find((opt) => opt.id === optionId)
      if (option) {
        Object.entries(option.scores).forEach(([madhhab, points]) => {
          newScores[madhhab] = (newScores[madhhab] || 0) + points
        })
      }
    })

    setScores(newScores)

    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOptions([])
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedOptions([])
    }
  }

  const handleRetake = () => {
    setCurrentQuestion(0)
    setSelectedOptions([])
    setScores({
      Hanafi: 0,
      Maliki: 0,
      "Shafi'i": 0,
      Hanbali: 0,
    })
    setShowResults(false)
    const questionsWithShuffledOptions = quizData.questions.map((question) => ({
      ...question,
      options: shuffleArray(question.options),
    }))
    setShuffledQuestions(questionsWithShuffledOptions)
  }

  if (showResults) {
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0)
    const percentages = Object.entries(scores).map(([madhhab, score]) => ({
      madhhab,
      percentage: totalScore > 0 ? Math.round((score / totalScore) * 100) : 0,
    }))
    percentages.sort((a, b) => b.percentage - a.percentage)

    const topMadhhab = percentages[0].madhhab
    const resultInfo = quizData.results[topMadhhab as keyof typeof quizData.results]

    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-400 to-teal-600 p-4 sm:p-6">
        <div className="max-w-3xl mx-auto pt-16">
          <div className="rounded-3xl bg-white p-6 sm:p-8 border-2 border-teal-200 shadow-lg font-sans">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">Your Results</h2>

            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200">
              <h3 className="text-xl font-bold text-teal-900 mb-2">{resultInfo.name}</h3>
              <p className="text-gray-700">{resultInfo.description}</p>
            </div>

            <div className="space-y-4 mb-8">
              {percentages.map(({ madhhab, percentage }) => (
                <div key={madhhab}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-900">{madhhab}</span>
                    <span className="font-bold text-teal-600">{percentage}%</span>
                  </div>
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleRetake}
                className="w-full px-6 py-3 rounded-2xl bg-white text-teal-600 border-2 border-teal-600 font-medium hover:bg-teal-50 transition-colors"
              >
                Retake Quiz
              </button>
              <Link
                href="/"
                className="w-full px-6 py-3 rounded-2xl bg-teal-600 text-white border-2 border-teal-700 font-medium hover:bg-teal-700 transition-colors text-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const question = shuffledQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / shuffledQuestions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 to-teal-600 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto pt-16 relative">
        {/* Back Button */}
        <Link
          href="/"
          className="absolute top-0 left-0 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>

        {/* Question Counter */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2">
          <div className="px-6 py-2 rounded-full bg-white/25 text-white backdrop-blur font-medium font-sans">
            Question {currentQuestion + 1} of {shuffledQuestions.length}
          </div>
        </div>

        {/* Quiz Card */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 border-2 border-teal-200 shadow-lg font-sans">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">{question.text}</h2>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {question.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                className={`w-full p-4 text-left rounded-2xl border-2 transition-all ${
                  selectedOptions.includes(option.id)
                    ? "border-teal-500 bg-gradient-to-br from-teal-50 to-cyan-50"
                    : "border-gray-200 bg-white hover:border-teal-200"
                }`}
              >
                <span className="text-gray-900">{option.text}</span>
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-3 rounded-2xl bg-white text-teal-600 border-2 border-teal-600 font-medium hover:bg-teal-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={selectedOptions.length === 0}
              className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white border-2 border-teal-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestion === shuffledQuestions.length - 1 ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
