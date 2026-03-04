"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { RefreshCw, Award, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

type Question = {
  id: number
  question: string
  options: string[]
  correct: number
  category: string
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Apa kepanjangan dari HTML?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Home Tool Markup Language",
      "Hyperlinks and Text Markup Language",
    ],
    correct: 0,
    category: "Web Dev",
  },
  {
    id: 2,
    question: "React menggunakan bahasa pemrograman apa?",
    options: ["Python", "JavaScript", "Java", "C++"],
    correct: 1,
    category: "Frontend",
  },
  {
    id: 3,
    question: "Apa itu REST API?",
    options: [
      "Rapid Exchange System Technology",
      "Representational State Transfer",
      "Remote Execution Server Toolkit",
      "Real-time Electronic Server Transfer",
    ],
    correct: 1,
    category: "Backend",
  },
  {
    id: 4,
    question: "Database yang paling sering digunakan untuk NoSQL adalah?",
    options: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"],
    correct: 2,
    category: "Database",
  },
  {
    id: 5,
    question: "Git digunakan untuk apa?",
    options: [
      "Membuat website",
      "Version control dan collaboration",
      "Database management",
      "Server hosting",
    ],
    correct: 1,
    category: "DevOps",
  },
  {
    id: 6,
    question: "Apa singkatan dari API?",
    options: [
      "Application Program Interface",
      "Advanced Programming Integration",
      "Automatic Program Instruction",
      "Application Process Integration",
    ],
    correct: 0,
    category: "Web Dev",
  },
  {
    id: 7,
    question: "Framework Laravel digunakan untuk?",
    options: [
      "Frontend development",
      "Backend development dengan PHP",
      "Mobile development",
      "Game development",
    ],
    correct: 1,
    category: "Backend",
  },
  {
    id: 8,
    question: "Apa itu TypeScript?",
    options: [
      "Bahasa untuk styling CSS",
      "Superset dari JavaScript dengan tipe statis",
      "Framework untuk testing",
      "Database query language",
    ],
    correct: 1,
    category: "Frontend",
  },
]

export function QuizGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showScore, setShowScore] = useState(false)
  const [questionsAsked, setQuestionsAsked] = useState(0)

  const question = QUIZ_QUESTIONS[currentQuestion]
  const isCorrect = selectedAnswer === question.correct

  const handleAnswerClick = (index: number) => {
    if (!answered) {
      setSelectedAnswer(index)
      setAnswered(true)

      if (index === question.correct) {
        setScore(score + 1)
      }
      setQuestionsAsked(questionsAsked + 1)
    }
  }

  const handleNext = () => {
    const nextQuestion = currentQuestion + 1
    if (nextQuestion < QUIZ_QUESTIONS.length && questionsAsked < 5) {
      setCurrentQuestion(nextQuestion)
      setAnswered(false)
      setSelectedAnswer(null)
    } else {
      setShowScore(true)
    }
  }

  const handleReset = () => {
    setCurrentQuestion(0)
    setScore(0)
    setAnswered(false)
    setSelectedAnswer(null)
    setShowScore(false)
    setQuestionsAsked(0)
  }

  return (
    <section id="quiz" className="relative py-24 px-8 md:px-12 border-t border-white/5">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-4">07 — INTERACTIVE</p>
        <h2 className="font-sans text-3xl md:text-5xl font-light italic flex items-center gap-4">
          Tech Quiz Challenge <Zap className="w-8 h-8 md:w-10 md:h-10 text-yellow-400" />
        </h2>
      </motion.div>

      {/* Quiz Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        {!showScore ? (
          <div className="p-8 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="font-mono text-sm text-muted-foreground">
                  Question {questionsAsked + 1} of 5
                </span>
                <span className="font-mono text-sm text-amber-400">
                  {question.category}
                </span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((questionsAsked + 1) / 5) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Question */}
            <h3 className="font-sans text-xl md:text-2xl font-light text-white mb-8">
              {question.question}
            </h3>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {question.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  disabled={answered}
                  whileHover={!answered ? { x: 4 } : {}}
                  className={`w-full p-4 rounded-lg border transition-all duration-300 text-left font-sans
                    ${
                      !answered
                        ? "border-white/10 bg-white/[0.02] hover:border-blue-500/30 hover:bg-white/[0.04] cursor-pointer"
                        : selectedAnswer === index
                          ? isCorrect
                            ? "border-green-500/50 bg-green-500/10 text-green-400"
                            : "border-red-500/50 bg-red-500/10 text-red-400"
                          : index === question.correct
                            ? "border-green-500/50 bg-green-500/10 text-green-400"
                            : "border-white/10 bg-white/[0.02] opacity-50"
                    }
                  `}
                >
                  {option}
                </motion.button>
              ))}
            </div>

            {/* Feedback */}
            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-8 p-4 rounded-lg ${
                  isCorrect
                    ? "bg-green-500/10 border border-green-500/30 text-green-400"
                    : "bg-red-500/10 border border-red-500/30 text-red-400"
                }`}
              >
                <p className="font-sans text-sm font-medium">
                  {isCorrect ? "Benar! 🎉" : "Salah. Jawaban yang benar adalah: " + question.options[question.correct]}
                </p>
              </motion.div>
            )}

            {/* Next Button */}
            {answered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Button
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-sans font-medium py-3 rounded-lg transition-all duration-300"
                >
                  {questionsAsked < 4 ? "Next Question" : "Finish Quiz"}
                </Button>
              </motion.div>
            )}
          </div>
        ) : (
          /* Score Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-xl border border-white/10 bg-white/[0.02] text-center"
          >
            <Award className="w-16 h-16 mx-auto mb-6 text-amber-400" />
            <h3 className="font-sans text-3xl font-light text-white mb-2">Quiz Selesai!</h3>
            <p className="font-mono text-muted-foreground mb-8">Lihat hasilmu di bawah</p>

            <div className="bg-white/[0.04] border border-white/10 rounded-lg p-6 mb-8">
              <p className="font-mono text-sm text-muted-foreground mb-2">SKOR AKHIR</p>
              <p className="font-sans text-5xl font-light text-white mb-2">
                {score} / 5
              </p>
              <p className="font-mono text-sm text-amber-400">
                {Math.round((score / 5) * 100)}%
              </p>
            </div>

            <Button
              onClick={handleReset}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-sans font-medium py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
