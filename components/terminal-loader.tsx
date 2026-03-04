"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function TerminalLoader() {
  const [visibleLines, setVisibleLines] = useState<number>(0)
  const [isShowing, setIsShowing] = useState(true)

  const logs = [
    { status: " OK ", text: "Booting personal system kernel..." },
    { status: " OK ", text: "Mounting virtual filesystems..." },
    { status: " OK ", text: "Starting network interface..." },
    { status: " OK ", text: "Establishing secure connection to Supabase DB..." },
    { status: " OK ", text: "Fetching [biodata] sequence..." },
    { status: " OK ", text: "Fetching [experiences] records..." },
    { status: " OK ", text: "Fetching [projects] metadata..." },
    { status: "WAIT", text: "Initializing user interface..." },
  ]

  useEffect(() => {
    // Memunculkan baris satu per satu setiap 200ms (animasi ketik)
    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= logs.length) {
          clearInterval(interval)
          // Jika semua baris sudah muncul, tunggu 1.5 detik agar kursor berkedip bisa dilihat
          // Setelah itu hilangkan loading screen-nya
          setTimeout(() => setIsShowing(false), 1500)
          return prev
        }
        return prev + 1
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {isShowing && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[999999] flex flex-col justify-center bg-[#050505] p-6 md:p-10 font-mono text-xs md:text-sm cursor-wait"
        >
          <div className="w-full max-w-4xl mx-auto flex flex-col gap-2">
            
            {/* Munculkan baris perlahan sesuai state visibleLines */}
            {logs.slice(0, visibleLines).map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-3"
              >
                <span className="text-gray-500">[</span>
                <span className={log.status === " OK " ? "text-green-500 font-bold" : "text-yellow-500 font-bold"}>
                  {log.status}
                </span>
                <span className="text-gray-500">]</span>
                <span className="text-gray-300">{log.text}</span>
              </motion.div>
            ))}

            {/* Jika baris log sudah habis, munculkan Prompt Kursor */}
            {visibleLines >= logs.length && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 mt-2"
              >
                <span className="text-blue-400 font-bold">guest@portfolio</span>
                <span className="text-white">:</span>
                <span className="text-blue-400 font-bold">~</span>
                <span className="text-white">$</span>
                <span className="w-2.5 h-4 bg-gray-300 inline-block animate-pulse" />
              </motion.div>
            )}

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}