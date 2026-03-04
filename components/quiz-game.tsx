"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RefreshCw, Award, Zap, Wifi, WifiOff, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// ─── Types ────────────────────────────────────────────────────────────────────

type Difficulty = "easy" | "medium" | "hard"

type Question = {
  id: number
  question: string
  options: string[]
  correct: number
  category: string
  difficulty: Difficulty
}

// ─── Local Question Bank ───────────────────────────────────────────────────────

const LOCAL_QUESTIONS: Question[] = [
  // Easy
  {
    id: 1,
    question: "Apa kepanjangan dari HTML?",
    options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"],
    correct: 0,
    category: "Web Dev",
    difficulty: "easy",
  },
  {
    id: 2,
    question: "React menggunakan bahasa pemrograman apa?",
    options: ["Python", "JavaScript", "Java", "C++"],
    correct: 1,
    category: "Frontend",
    difficulty: "easy",
  },
  {
    id: 3,
    question: "Apa singkatan dari API?",
    options: ["Application Program Interface", "Advanced Programming Integration", "Automatic Program Instruction", "Application Process Integration"],
    correct: 0,
    category: "Web Dev",
    difficulty: "easy",
  },
  {
    id: 4,
    question: "Git digunakan untuk apa?",
    options: ["Membuat website", "Version control dan collaboration", "Database management", "Server hosting"],
    correct: 1,
    category: "DevOps",
    difficulty: "easy",
  },
  {
    id: 5,
    question: "Apa ekstensi file JavaScript?",
    options: [".java", ".py", ".js", ".ts"],
    correct: 2,
    category: "Web Dev",
    difficulty: "easy",
  },
  {
    id: 6,
    question: "CSS adalah singkatan dari?",
    options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
    correct: 1,
    category: "Web Dev",
    difficulty: "easy",
  },
  // Medium
  {
    id: 7,
    question: "Apa itu REST API?",
    options: ["Rapid Exchange System Technology", "Representational State Transfer", "Remote Execution Server Toolkit", "Real-time Electronic Server Transfer"],
    correct: 1,
    category: "Backend",
    difficulty: "medium",
  },
  {
    id: 8,
    question: "Database yang paling sering digunakan untuk NoSQL adalah?",
    options: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"],
    correct: 2,
    category: "Database",
    difficulty: "medium",
  },
  {
    id: 9,
    question: "Apa itu TypeScript?",
    options: ["Bahasa untuk styling CSS", "Superset dari JavaScript dengan tipe statis", "Framework untuk testing", "Database query language"],
    correct: 1,
    category: "Frontend",
    difficulty: "medium",
  },
  {
    id: 10,
    question: "Framework Laravel digunakan untuk?",
    options: ["Frontend development", "Backend development dengan PHP", "Mobile development", "Game development"],
    correct: 1,
    category: "Backend",
    difficulty: "medium",
  },
  {
    id: 11,
    question: "Apa itu Docker?",
    options: ["Text editor", "Platform containerization untuk deploy aplikasi", "Framework JavaScript", "Database management system"],
    correct: 1,
    category: "DevOps",
    difficulty: "medium",
  },
  {
    id: 12,
    question: "Hook useState di React digunakan untuk?",
    options: ["Fetching data dari API", "Mengelola state lokal dalam komponen", "Membuat routing", "Styling komponen"],
    correct: 1,
    category: "Frontend",
    difficulty: "medium",
  },
  // Hard
  {
    id: 13,
    question: "Apa perbedaan antara 'null' dan 'undefined' di JavaScript?",
    options: [
      "Keduanya sama saja",
      "null = nilai kosong yang disengaja, undefined = variabel belum diinisialisasi",
      "undefined = nilai kosong yang disengaja, null = variabel belum diinisialisasi",
      "null hanya untuk object, undefined untuk primitive",
    ],
    correct: 1,
    category: "JavaScript",
    difficulty: "hard",
  },
  {
    id: 14,
    question: "Apa itu event loop di Node.js?",
    options: [
      "Loop biasa seperti for/while",
      "Mekanisme yang memungkinkan Node.js menjalankan operasi non-blocking I/O",
      "Library untuk event handling",
      "Framework untuk real-time communication",
    ],
    correct: 1,
    category: "Backend",
    difficulty: "hard",
  },
  {
    id: 15,
    question: "Big O notation O(log n) berarti?",
    options: [
      "Kompleksitas bertumbuh linear",
      "Kompleksitas konstan",
      "Kompleksitas bertumbuh logaritmik — efisien untuk data besar",
      "Kompleksitas kuadratik",
    ],
    correct: 2,
    category: "CS Fundamentals",
    difficulty: "hard",
  },
  {
    id: 16,
    question: "Apa itu CORS dan kenapa penting?",
    options: [
      "Cara styling CSS lintas browser",
      "Cross-Origin Resource Sharing — mekanisme keamanan browser untuk request lintas domain",
      "Protocol enkripsi data",
      "Method HTTP untuk update data",
    ],
    correct: 1,
    category: "Web Dev",
    difficulty: "hard",
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function decodeHTML(str: string): string {
  const txt = document.createElement("textarea")
  txt.innerHTML = str
  return txt.value
}

// ─── Open Trivia DB Fetcher ────────────────────────────────────────────────────

async function fetchAPIQuestions(difficulty: Difficulty, amount = 5): Promise<Question[] | null> {
  try {
    // Category 18 = Computers, 11 = General Knowledge
    const url = `https://opentdb.com/api.php?amount=${amount}&category=18&difficulty=${difficulty}&type=multiple`
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) })
    if (!res.ok) return null
    const data = await res.json()
    if (data.response_code !== 0 || !data.results?.length) return null

    return data.results.map((q: any, i: number) => {
      const incorrect: string[] = q.incorrect_answers.map(decodeHTML)
      const correct = decodeHTML(q.correct_answer)
      const options = shuffle([correct, ...incorrect])
      return {
        id: 1000 + i,
        question: decodeHTML(q.question),
        options,
        correct: options.indexOf(correct),
        category: decodeHTML(q.category).replace("Entertainment: ", "").replace("Science: ", ""),
        difficulty,
      }
    })
  } catch {
    return null
  }
}

// ─── Difficulty Config ─────────────────────────────────────────────────────────

const DIFFICULTY_CONFIG = {
  easy:   { label: "Easy",   color: "text-emerald-400", border: "border-emerald-500/40", bg: "bg-emerald-500/10", accent: "from-emerald-500 to-teal-500" },
  medium: { label: "Medium", color: "text-amber-400",   border: "border-amber-500/40",   bg: "bg-amber-500/10",   accent: "from-amber-500 to-orange-500" },
  hard:   { label: "Hard",   color: "text-rose-400",    border: "border-rose-500/40",     bg: "bg-rose-500/10",     accent: "from-rose-500 to-pink-500" },
}

const TOTAL_QUESTIONS = 5

// ─── Score Messages ────────────────────────────────────────────────────────────

function getScoreMessage(score: number): string {
  if (score === 5) return "Perfect! Kamu jenius! 🏆"
  if (score >= 4) return "Hampir sempurna! Keren banget 🔥"
  if (score >= 3) return "Lumayan! Masih bisa lebih baik 💪"
  if (score >= 2) return "Cukup, tapi perlu belajar lagi 📚"
  return "Ayo belajar lebih giat lagi! 😅"
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function QuizGame() {
  const [phase, setPhase] = useState<"select" | "playing" | "score">("select")
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isFromAPI, setIsFromAPI] = useState(false)
  const [direction, setDirection] = useState(1)

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / TOTAL_QUESTIONS) * 100
  const cfg = DIFFICULTY_CONFIG[difficulty]

  // ── Load questions ────────────────────────────────────────────────────────

  const loadQuestions = useCallback(async (diff: Difficulty) => {
    setIsLoading(true)
    const apiQuestions = await fetchAPIQuestions(diff, TOTAL_QUESTIONS)
    if (apiQuestions && apiQuestions.length >= TOTAL_QUESTIONS) {
      setQuestions(apiQuestions)
      setIsFromAPI(true)
    } else {
      // Fallback: local bank filtered by difficulty, then shuffled
      const local = LOCAL_QUESTIONS.filter((q) => q.difficulty === diff)
      const fallback = shuffle(local).slice(0, TOTAL_QUESTIONS)
      setQuestions(fallback.length >= TOTAL_QUESTIONS ? fallback : shuffle(LOCAL_QUESTIONS).slice(0, TOTAL_QUESTIONS))
      setIsFromAPI(false)
    }
    setIsLoading(false)
  }, [])

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleStart = async () => {
    await loadQuestions(difficulty)
    setCurrentIndex(0)
    setScore(0)
    setAnswered(false)
    setSelectedAnswer(null)
    setPhase("playing")
  }

  const handleAnswer = (index: number) => {
    if (answered || !currentQuestion) return
    setSelectedAnswer(index)
    setAnswered(true)
    if (index === currentQuestion.correct) setScore((s) => s + 1)
  }

  const handleNext = () => {
    setDirection(1)
    if (currentIndex + 1 >= TOTAL_QUESTIONS) {
      setPhase("score")
    } else {
      setCurrentIndex((i) => i + 1)
      setAnswered(false)
      setSelectedAnswer(null)
    }
  }

  const handleReset = () => {
    setPhase("select")
    setQuestions([])
    setCurrentIndex(0)
    setScore(0)
    setAnswered(false)
    setSelectedAnswer(null)
  }

  // ── Slide variants ────────────────────────────────────────────────────────

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <section id="quiz" className="relative py-24 px-8 md:px-12 border-t border-white/5">

      {/* Header */}
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

      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait" custom={direction}>

          {/* ── Phase: Select Difficulty ── */}
          {phase === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="p-8 rounded-xl border border-white/10 bg-white/2"
            >
              <h3 className="font-sans text-2xl font-light text-white mb-2">Pilih Kesulitan</h3>
              <p className="font-mono text-sm text-muted-foreground mb-8">
                Soal diambil dari Open Trivia DB. Jika offline, soal lokal akan digunakan.
              </p>

              <div className="grid grid-cols-3 gap-3 mb-8">
                {(["easy", "medium", "hard"] as Difficulty[]).map((d) => {
                  const c = DIFFICULTY_CONFIG[d]
                  const selected = difficulty === d
                  return (
                    <motion.button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className={`relative p-4 rounded-lg border transition-all duration-300 text-center
                        ${selected
                          ? `${c.border} ${c.bg} ${c.color}`
                          : "border-white/10 bg-white/2 text-muted-foreground hover:border-white/20"
                        }`}
                    >
                      {selected && (
                        <motion.div
                          layoutId="diff-indicator"
                          className={`absolute inset-0 rounded-lg ${c.bg} border ${c.border}`}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <span className="relative font-sans font-medium text-sm">{c.label}</span>
                    </motion.button>
                  )
                })}
              </div>

              <Button
                onClick={handleStart}
                disabled={isLoading}
                className={`w-full bg-linear-gradient(to right, ${cfg.accent}) text-white font-sans font-medium py-3 rounded-lg
                  transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50`}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </motion.div>
                    Memuat soal...
                  </>
                ) : (
                  <>Mulai Quiz <ChevronRight className="w-4 h-4" /></>
                )}
              </Button>
            </motion.div>
          )}

          {/* ── Phase: Playing ── */}
          {phase === "playing" && currentQuestion && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="p-8 rounded-xl border border-white/10 bg-white/2"
            >
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-mono text-sm text-muted-foreground">
                    {currentIndex + 1} / {TOTAL_QUESTIONS}
                  </span>
                  <div className="flex items-center gap-2">
                    {isFromAPI
                      ? <Wifi className="w-3 h-3 text-emerald-400" />
                      : <WifiOff className="w-3 h-3 text-amber-400" />
                    }
                    <span className={`font-mono text-xs ${cfg.color}`}>{cfg.label}</span>
                    <span className="font-mono text-xs text-muted-foreground">· {currentQuestion.category}</span>
                  </div>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-linear-gradient(to right, ${cfg.accent})`}
                    initial={{ width: `${((currentIndex) / TOTAL_QUESTIONS) * 100}%` }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Question — slides between questions */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <h3 className="font-sans text-xl md:text-2xl font-light text-white mb-8 leading-relaxed">
                    {currentQuestion.question}
                  </h3>

                  {/* Options */}
                  <div className="space-y-3 mb-8">
                    {currentQuestion.options.map((option, index) => {
                      const isSelected = selectedAnswer === index
                      const isCorrectOption = index === currentQuestion.correct
                      let optionClass = "border-white/10 bg-white/2 hover:border-white/20 hover:bg-white/4 cursor-pointer"

                      if (answered) {
                        if (isCorrectOption) {
                          optionClass = "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                        } else if (isSelected && !isCorrectOption) {
                          optionClass = "border-rose-500/50 bg-rose-500/10 text-rose-400"
                        } else {
                          optionClass = "border-white/5 bg-white/1 opacity-40"
                        }
                      }

                      return (
                        <motion.button
                          key={index}
                          onClick={() => handleAnswer(index)}
                          disabled={answered}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.07, duration: 0.3 }}
                          whileHover={!answered ? { x: 4 } : {}}
                          whileTap={!answered ? { scale: 0.99 } : {}}
                          className={`w-full p-4 rounded-lg border transition-all duration-250 text-left font-sans text-sm md:text-base ${optionClass}`}
                        >
                          <span className="flex items-center gap-3">
                            <span className="font-mono text-xs text-muted-foreground w-5 shrink-0">
                              {String.fromCharCode(65 + index)}.
                            </span>
                            {option}
                          </span>
                        </motion.button>
                      )
                    })}
                  </div>

                  {/* Feedback */}
                  <AnimatePresence>
                    {answered && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                        className={`mb-6 p-4 rounded-lg border ${
                          selectedAnswer === currentQuestion.correct
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                        }`}
                      >
                        <p className="font-sans text-sm font-medium">
                          {selectedAnswer === currentQuestion.correct
                            ? "Benar! 🎉"
                            : `Salah. Jawaban yang benar: ${currentQuestion.options[currentQuestion.correct]}`
                          }
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Next Button */}
                  <AnimatePresence>
                    {answered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <Button
                          onClick={handleNext}
                          className={`w-full bg-linear-gradient(to right, ${cfg.accent}) text-white font-sans font-medium
                            py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2`}
                        >
                          {currentIndex + 1 < TOTAL_QUESTIONS ? (
                            <>Next Question <ChevronRight className="w-4 h-4" /></>
                          ) : (
                            <>Lihat Hasil <Award className="w-4 h-4" /></>
                          )}
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {/* ── Phase: Score ── */}
          {phase === "score" && (
            <motion.div
              key="score"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="p-8 rounded-xl border border-white/10 bg-white/2 text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
              >
                <Award className="w-16 h-16 mx-auto mb-6 text-amber-400" />
              </motion.div>

              <h3 className="font-sans text-3xl font-light text-white mb-2">Quiz Selesai!</h3>
              <p className="font-mono text-sm text-muted-foreground mb-8">{getScoreMessage(score)}</p>

              {/* Score Display */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`${cfg.bg} border ${cfg.border} rounded-xl p-6 mb-4`}
              >
                <p className="font-mono text-xs text-muted-foreground mb-2 tracking-widest">SKOR AKHIR</p>
                <p className="font-sans text-6xl font-light text-white mb-1">{score}<span className="text-3xl text-muted-foreground"> / {TOTAL_QUESTIONS}</span></p>
                <p className={`font-mono text-sm ${cfg.color}`}>{Math.round((score / TOTAL_QUESTIONS) * 100)}% benar</p>
              </motion.div>

              {/* Difficulty badge */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`font-mono text-xs ${cfg.color} mb-8`}
              >
                Difficulty: {cfg.label} {isFromAPI ? "· via Open Trivia DB" : "· local questions"}
              </motion.p>

              {/* Dot indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="flex justify-center gap-2 mb-8"
              >
                {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.06 }}
                    className={`w-3 h-3 rounded-full ${i < score ? "bg-emerald-400" : "bg-white/10"}`}
                  />
                ))}
              </motion.div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 border-white/10 bg-transparent text-muted-foreground hover:text-white hover:border-white/20 font-sans font-medium py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Ganti Level
                </Button>
                <Button
                  onClick={handleStart}
                  className={`flex-1 bg-linear-gradient(to right, ${cfg.accent}) text-white font-sans font-medium py-3 rounded-lg flex items-center justify-center gap-2`}
                >
                  <Zap className="w-4 h-4" />
                  Main Lagi
                </Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </section>
  )
}