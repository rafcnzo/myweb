"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

type Quote = {
  content: string
  author: string
}

export function QuoteTicker() {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const res = await fetch("https://api.quotable.io/random")
        const data = await res.json()
        setQuote({
          content: data.content,
          author: data.author.replace(", type.fit", ""),
        })
      } catch (error) {
        console.error("Error fetching quote:", error)
        setQuote({
          content: "The only way to do great work is to love what you do.",
          author: "Steve Jobs",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchQuote()
    // Fetch new quote every 10 seconds
    const interval = setInterval(fetchQuote, 10000)
    return () => clearInterval(interval)
  }, [])

  if (loading || !quote) {
    return null
  }

  return (
    <div className="overflow-hidden bg-white/[0.02] border-b border-white/10">
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: "-100%" }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex items-center gap-8 whitespace-nowrap py-3 px-8"
      >
        {/* Repeat quote multiple times for seamless scroll */}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <span className="text-amber-500 text-lg font-light">✦</span>
              <span className="font-mono text-xs tracking-wider text-white">
                "{quote.content}"
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                — {quote.author}
              </span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
