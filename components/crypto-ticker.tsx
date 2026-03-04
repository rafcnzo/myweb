"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react"

// ─── Types ─────────────────────────────────────────────────────────────────────

type Crypto = {
  name: string
  symbol: string
  price_usd: number
  price_idr: number
  change_24h: number
  logo: string
}

type CachePayload = {
  data: Crypto[]
  fetchedAt: number // epoch ms
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const CACHE_KEY = "crypto_ticker_cache"
const CACHE_TTL = 45_000 // 45 seconds — matches CoinGecko free tier limit
const POLL_INTERVAL = 45_000

const COIN_MAPPING: Record<string, { name: string; symbol: string; logo: string }> = {
  bitcoin: {
    name: "Bitcoin",
    symbol: "BTC",
    logo: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579",
  },
  ethereum: {
    name: "Ethereum",
    symbol: "ETH",
    logo: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501628",
  },
  solana: {
    name: "Solana",
    symbol: "SOL",
    logo: "https://assets.coingecko.com/coins/images/4128/large/solana.png?1718187507",
  },
  hyperliquid: {
    name: "Hyperliquid",
    symbol: "HYPE",
    logo: "https://assets.coingecko.com/coins/images/50882/large/hyperliquid.jpg?1729431300",
  },
}

// ─── Cache Helpers ─────────────────────────────────────────────────────────────

function readCache(): CachePayload | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed: CachePayload = JSON.parse(raw)
    const age = Date.now() - parsed.fetchedAt
    if (age > CACHE_TTL) return null // stale
    return parsed
  } catch {
    return null
  }
}

function writeCache(data: Crypto[]) {
  try {
    const payload: CachePayload = { data, fetchedAt: Date.now() }
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
  } catch {
    // localStorage unavailable — silently skip
  }
}

// ─── API Fetch ─────────────────────────────────────────────────────────────────

async function fetchFromAPI(): Promise<Crypto[]> {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,hyperliquid&vs_currencies=usd,idr&include_24hr_change=true",
    { signal: AbortSignal.timeout(8000) }
  )
  if (!res.ok) throw new Error(`CoinGecko ${res.status}`)
  const data = await res.json()

  return Object.entries(data).map(([key, prices]: [string, any]) => ({
    name: COIN_MAPPING[key]?.name ?? key,
    symbol: COIN_MAPPING[key]?.symbol ?? key.toUpperCase(),
    price_usd: prices.usd ?? 0,
    price_idr: prices.idr ?? 0,
    change_24h: prices.usd_24h_change ?? 0,
    logo: COIN_MAPPING[key]?.logo ?? "",
  }))
}

// ─── Skeleton Card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="relative flex flex-col justify-between p-6 rounded-xl border border-white/10 bg-white/2 overflow-hidden">
      {/* shimmer */}
      <motion.div
        className="absolute inset-0 -translate-x-full bg-linear-gradient(to right, transparent, white/4, transparent)"
        animate={{ x: ["−100%", "200%"] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "linear", repeatDelay: 0.3 }}
      />
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-white/10" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-24 rounded bg-white/10" />
          <div className="h-3 w-10 rounded bg-white/5" />
        </div>
      </div>
      <div className="space-y-3 mb-6">
        <div className="h-3 w-8 rounded bg-white/5" />
        <div className="h-6 w-32 rounded bg-white/10" />
        <div className="h-3 w-8 rounded bg-white/5" />
        <div className="h-6 w-40 rounded bg-white/10" />
      </div>
      <div className="pt-4 border-t border-white/5 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-white/10" />
        <div className="h-3 w-20 rounded bg-white/5" />
      </div>
    </div>
  )
}

// ─── Crypto Card ───────────────────────────────────────────────────────────────

function CryptoCard({ crypto, index }: { crypto: Crypto; index: number }) {
  const isPositive = crypto.change_24h >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative flex flex-col justify-between p-6 rounded-xl border border-white/10 bg-white/2 hover:bg-white/4 hover:border-amber-500/30 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-3">
          {crypto.logo && (
            <img src={crypto.logo} alt={crypto.name} className="w-10 h-10 rounded-full" />
          )}
          <div>
            <h3 className="font-sans font-medium text-white group-hover:text-amber-400 transition-colors">
              {crypto.name}
            </h3>
            <p className="font-mono text-xs text-muted-foreground uppercase">{crypto.symbol}</p>
          </div>
        </div>

        {/* 24h Change Badge */}
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-medium
            ${isPositive
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
            }`}
        >
          {isPositive
            ? <TrendingUp className="w-3 h-3" />
            : <TrendingDown className="w-3 h-3" />
          }
          {isPositive ? "+" : ""}{crypto.change_24h.toFixed(2)}%
        </div>
      </div>

      {/* Prices */}
      <div className="mb-6 space-y-3">
        <div>
          <p className="font-mono text-xs text-muted-foreground mb-1">USD</p>
          <p className="font-sans text-xl font-light text-white tabular-nums">
            ${crypto.price_usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div>
          <p className="font-mono text-xs text-muted-foreground mb-1">IDR</p>
          <p className="font-sans text-xl font-light text-white tabular-nums">
            Rp{crypto.price_idr.toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 pt-4 border-t border-white/5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <p className="font-mono text-xs text-muted-foreground">LIVE</p>
      </div>
    </motion.div>
  )
}

// ─── Relative time helper ──────────────────────────────────────────────────────

function useRelativeTime(epochMs: number | null) {
  const [label, setLabel] = useState("")

  useEffect(() => {
    if (!epochMs) return
    const update = () => {
      const diff = Math.floor((Date.now() - epochMs) / 1000)
      if (diff < 5) setLabel("baru saja")
      else if (diff < 60) setLabel(`${diff} detik lalu`)
      else setLabel(`${Math.floor(diff / 60)} menit lalu`)
    }
    update()
    const id = setInterval(update, 5000)
    return () => clearInterval(id)
  }, [epochMs])

  return label
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function CryptoTicker() {
  const [cryptos, setCryptos] = useState<Crypto[]>([])
  const [fetchedAt, setFetchedAt] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const relativeTime = useRelativeTime(fetchedAt)

  const load = async (force = false) => {
    // 1. Try cache first (unless forced)
    if (!force) {
      const cached = readCache()
      if (cached) {
        setCryptos(cached.data)
        setFetchedAt(cached.fetchedAt)
        setLoading(false)
        return
      }
    }

    // 2. Hit the API
    setIsRefreshing(true)
    try {
      const fresh = await fetchFromAPI()
      writeCache(fresh)
      setCryptos(fresh)
      setFetchedAt(Date.now())
    } catch (err) {
      console.error("CoinGecko fetch error:", err)
      // On error, still try to show stale cache if available
      try {
        const raw = localStorage.getItem(CACHE_KEY)
        if (raw) {
          const stale: CachePayload = JSON.parse(raw)
          setCryptos(stale.data)
          setFetchedAt(stale.fetchedAt)
        }
      } catch {}
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    load()
    const id = setInterval(() => load(true), POLL_INTERVAL)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="crypto" className="relative py-2 px-8 md:px-12 border-t border-white/5">

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
      >
        <div>
          <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-4">06 — BLOCKCHAIN</p>
          <h2 className="font-sans text-3xl md:text-5xl font-light italic">
            Cryptocurrency Prices
          </h2>
        </div>

        {/* Last updated + refresh */}
        {fetchedAt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 font-mono text-xs text-muted-foreground"
          >
            <motion.div
              animate={isRefreshing ? { rotate: 360 } : {}}
              transition={{ duration: 0.8, ease: "linear", repeat: isRefreshing ? Infinity : 0 }}
            >
              <RefreshCw className="w-3 h-3" />
            </motion.div>
            <span>Diperbarui {relativeTime}</span>
          </motion.div>
        )}
      </motion.div>

      {/* Grid — skeleton or real cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : cryptos.map((crypto, i) => <CryptoCard key={crypto.symbol} crypto={crypto} index={i} />)
        }
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="font-mono text-xs text-muted-foreground">
          Data dari CoinGecko · Cache 45 detik · Refresh otomatis
        </p>
      </div>
    </section>
  )
}