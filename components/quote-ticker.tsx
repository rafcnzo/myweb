"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, Loader2 } from "lucide-react"


type Lang = "en" | "id"

type Quote = {
  content: string
  author: string
  contentId?: string // cached Indonesian translation
}

type CachePayload = {
  quote: Quote
  fetchedAt: number
}


const FETCH_INTERVAL = 5 * 60 * 1000 // 5 minutes
const CACHE_KEY      = "quote_ticker_v1"
const CACHE_TTL      = 5 * 60 * 1000

const FALLBACK: Quote = {
  content:   "The only way to do great work is to love what you do.",
  author:    "Steve Jobs",
  contentId: "Satu-satunya cara untuk melakukan pekerjaan hebat adalah mencintai apa yang kamu kerjakan.",
}


function readCache(): CachePayload | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed: CachePayload = JSON.parse(raw)
    if (Date.now() - parsed.fetchedAt > CACHE_TTL) return null
    return parsed
  } catch {
    return null
  }
}

function writeCache(quote: Quote) {
  try {
    const payload: CachePayload = { quote, fetchedAt: Date.now() }
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
  } catch {}
}


async function fetchZenQuote(): Promise<Quote> {
  const res = await fetch("/api/quote", { signal: AbortSignal.timeout(8000) })
  if (!res.ok) throw new Error(`Quote proxy ${res.status}`)
  const data = await res.json()
  return { content: data.content, author: data.author }
}


async function translateToId(text: string): Promise<string> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|id`
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
  if (!res.ok) throw new Error(`MyMemory ${res.status}`)
  const data = await res.json()
  const translated: string = data?.responseData?.translatedText ?? ""
  if (!translated || data?.responseStatus !== 200) throw new Error("Empty translation")
  return translated
}


function SeamlessTicker({ quote, lang }: { quote: Quote; lang: Lang }) {
  const text     = lang === "id" && quote.contentId ? quote.contentId : quote.content
  const duration = Math.max(22, Math.min(60, text.length * 0.28))

  const Item = ({ id }: { id: string }) => (
    <span key={id} className="inline-flex items-center gap-6 pr-20">
      <span className="text-amber-500 text-base font-light select-none">✦</span>
      <span className="font-mono text-xs tracking-wider text-white">
        &ldquo;{text}&rdquo;
      </span>
      <span className="font-mono text-xs text-muted-foreground">— {quote.author}</span>
    </span>
  )

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute left-0 inset-y-0 w-12 z-10 bg-linear-gradient(to right, #050505, transparent)" />
      <div className="pointer-events-none absolute right-0 inset-y-0 w-12 z-10 bg-linear-gradient(to left, #050505, transparent)" />

      <AnimatePresence mode="wait">
        <motion.div
          key={text}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex whitespace-nowrap py-3"
        >
          <motion.div
            className="flex"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration, repeat: Infinity, ease: "linear" }}
          >
            <Item id="a" />
            <Item id="b" />
            <Item id="c" />
            <Item id="d" />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}


function LangToggle({
  lang,
  onToggle,
  isTranslating,
}: {
  lang: Lang
  onToggle: () => void
  isTranslating: boolean
}) {
  return (
    <button
      onClick={onToggle}
      disabled={isTranslating}
      title={lang === "en" ? "Terjemahkan ke Indonesia" : "Switch to English"}
      className="shrink-0 flex items-center gap-1.5 px-3 h-full
        font-mono text-[10px] tracking-[0.2em] uppercase
        text-muted-foreground hover:text-white
        transition-colors duration-200 disabled:opacity-40"
    >
      {isTranslating
        ? <Loader2 className="w-3 h-3 animate-spin" />
        : <Globe className="w-3 h-3" />
      }
      {lang === "en" ? "ID" : "EN"}
    </button>
  )
}


export function QuoteTicker() {
  const [quote,         setQuote        ] = useState<Quote | null>(null)
  const [lang,          setLang         ] = useState<Lang>("en")
  const [isTranslating, setIsTranslating] = useState(false)
  const [loading,       setLoading      ] = useState(true)


  const loadQuote = useCallback(async (force = false) => {
    if (!force) {
      const cached = readCache()
      if (cached) {
        setQuote(cached.quote)
        setLoading(false)
        return
      }
    }
    try {
      const fresh = await fetchZenQuote()
      writeCache(fresh)
      setQuote(fresh)
    } catch {
      setQuote(prev => prev ?? FALLBACK)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadQuote()
    const id = setInterval(() => loadQuote(true), FETCH_INTERVAL)
    return () => clearInterval(id)
  }, [loadQuote])


  const handleToggle = async () => {
    if (!quote) return
    const next: Lang = lang === "en" ? "id" : "en"
    setLang(next)

    if (next === "id" && !quote.contentId) {
      setIsTranslating(true)
      try {
        const translated = await translateToId(quote.content)
        const updated: Quote = { ...quote, contentId: translated }
        setQuote(updated)
        writeCache(updated)
      } catch {
        setLang("en")
      } finally {
        setIsTranslating(false)
      }
    }
  }

  if (loading || !quote) return null

  return (
      <div className="flex items-center bg-white/2 border-b border-white/10">
      <div className="border-r border-white/10 self-stretch flex items-center">
        <LangToggle lang={lang} onToggle={handleToggle} isTranslating={isTranslating} />
      </div>

      <div className="flex-1 min-w-0">
        <SeamlessTicker quote={quote} lang={lang} />
      </div>
    </div>
  )
}