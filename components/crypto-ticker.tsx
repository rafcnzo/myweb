"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

type CryptoData = {
  usd: number
  idr: number
}

type Crypto = {
  name: string
  symbol: string
  price_usd: number
  price_idr: number
}

const COIN_MAPPING: Record<string, { name: string; symbol: string }> = {
  bitcoin: { name: "Bitcoin", symbol: "BTC" },
  ethereum: { name: "Ethereum", symbol: "ETH" },
  solana: { name: "Solana", symbol: "SOL" },
  hype: { name: "Hyperliquid", symbol: "HYPE" },
}

export function CryptoTicker() {
  const [cryptos, setCryptos] = useState<Crypto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,hype&vs_currencies=usd,idr`
        )
        const data = await res.json()
        
        const formattedData = Object.entries(data).map(([key, prices]: [string, any]) => ({
          name: COIN_MAPPING[key]?.name || key,
          symbol: COIN_MAPPING[key]?.symbol || key.toUpperCase(),
          price_usd: prices.usd || 0,
          price_idr: prices.idr || 0,
        }))
        
        setCryptos(formattedData)
      } catch (error) {
        console.error("Error fetching crypto data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCryptos()
    const interval = setInterval(fetchCryptos, 45000) // Update every 45 seconds
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <section className="relative py-24 px-8 md:px-12 border-t border-white/5">
        <div className="text-center">
          <p className="font-mono text-xs tracking-widest text-muted-foreground">
            LOADING CRYPTO DATA...
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="crypto" className="relative py-24 px-8 md:px-12 border-t border-white/5">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-4">06 — BLOCKCHAIN</p>
        <h2 className="font-sans text-3xl md:text-5xl font-light italic flex items-center gap-4">
          Cryptocurrency Prices
        </h2>
      </motion.div>

      {/* Crypto Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cryptos.map((crypto, index) => (
          <motion.div
            key={crypto.symbol}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative flex flex-col justify-between p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-amber-500/30 transition-all duration-300"
          >
            {/* Crypto Info */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-sans font-medium text-white group-hover:text-amber-400 transition-colors">
                  {crypto.name}
                </h3>
                <p className="font-mono text-xs text-muted-foreground uppercase">
                  {crypto.symbol}
                </p>
              </div>
            </div>

            {/* Prices */}
            <div className="mb-6 space-y-3">
              {/* USD Price */}
              <div>
                <p className="font-mono text-xs text-muted-foreground mb-1">USD</p>
                <p className="font-sans text-xl font-light text-white">
                  ${crypto.price_usd.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              {/* IDR Price */}
              <div>
                <p className="font-mono text-xs text-muted-foreground mb-1">IDR</p>
                <p className="font-sans text-xl font-light text-white">
                  Rp{crypto.price_idr.toLocaleString("id-ID", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
            </div>

            {/* Live Indicator */}
            <div className="flex items-center gap-2 pt-4 border-t border-white/5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <p className="font-mono text-xs text-muted-foreground">LIVE</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-12 text-center">
        <p className="font-mono text-xs text-muted-foreground">
          Data dari CoinGecko • Diupdate setiap 45 detik
        </p>
      </div>
    </section>
  )
}
