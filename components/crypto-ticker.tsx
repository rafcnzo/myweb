"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"

type Crypto = {
  id: string
  name: string
  symbol: string
  current_price: number
  price_change_percentage_24h: number
  market_cap_rank: number
  image: string
}

export function CryptoTicker() {
  const [cryptos, setCryptos] = useState<Crypto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&sparkline=false&locale=en`
        )
        const data = await res.json()
        setCryptos(data)
      } catch (error) {
        console.error("Error fetching crypto data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCryptos()
    const interval = setInterval(fetchCryptos, 30000) // Update every 30 seconds
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cryptos.map((crypto, index) => {
          const isPositive = crypto.price_change_percentage_24h >= 0
          return (
            <motion.div
              key={crypto.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative flex flex-col justify-between p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-amber-500/30 transition-all duration-300"
            >
              {/* Crypto Info */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <img
                    src={crypto.image}
                    alt={crypto.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <h3 className="font-sans font-medium text-white group-hover:text-amber-400 transition-colors">
                      {crypto.name}
                    </h3>
                    <p className="font-mono text-xs text-muted-foreground">
                      #{crypto.market_cap_rank}
                    </p>
                  </div>
                </div>
                <p className="font-mono text-sm text-muted-foreground">
                  {crypto.symbol.toUpperCase()}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <p className="font-sans text-2xl font-light text-white mb-2">
                  ${crypto.current_price.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>

                {/* Change 24h */}
                <div className={`flex items-center gap-2 font-mono text-sm ${
                  isPositive ? "text-green-400" : "text-red-400"
                }`}>
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>
                    {isPositive ? "+" : ""}
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                  </span>
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
          )
        })}
      </div>

      {/* Footer Note */}
      <div className="mt-12 text-center">
        <p className="font-mono text-xs text-muted-foreground">
          Data dari CoinGecko • Diupdate setiap 30 detik
        </p>
      </div>
    </section>
  )
}
