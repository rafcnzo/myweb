"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Download } from "lucide-react"
import { SentientSphere } from "./sentient-sphere"
import type { Biodata } from "@/lib/supabase"

// Terima props dari page.tsx
export function Hero({ initialBiodata }: { initialBiodata: Biodata | null }) {
  const containerRef = useRef<HTMLElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  // Langsung olah datanya tanpa perlu nunggu loading
  const roleParts = initialBiodata?.role?.split(" ") || ["SYSTEM", "ARCHITECT"]
  const lastWord = roleParts.pop() || ""
  const firstWords = roleParts.join(" ") || ""

  // Handle CV Download
  const handleDownloadCV = async () => {
    if (!initialBiodata?.cv_path) {
      alert("CV tidak tersedia untuk diunduh")
      return
    }
    
    setIsDownloading(true)
    try {
      const response = await fetch(initialBiodata.cv_path)
      if (!response.ok) throw new Error("Failed to download CV")
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `CV-${initialBiodata.name || "resume"}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading CV:", error)
      alert("Gagal mengunduh CV")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <section id="about" ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[#050505]">
      <div className="absolute inset-0">
        <SentientSphere />
      </div>

      <motion.div style={{ opacity, scale }} className="relative z-10 h-full flex flex-col justify-between pt-32 md:pt-20 pb-8 px-8 md:px-12 md:py-20">
        
        {/* Top Left - Name & CV Button */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-2">
              {initialBiodata?.name?.toUpperCase() || "SYSTEM USER"}
            </p>
            <h2 className="font-sans text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-balance">
              {firstWords}
              <br />
              <span className="italic">{lastWord}</span>
            </h2>
          </div>

          {/* Download CV Button */}
          {initialBiodata?.cv_path && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              onClick={handleDownloadCV}
              disabled={isDownloading}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 hover:border-amber-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              <span className="font-mono text-sm font-medium">
                {isDownloading ? "DOWNLOADING..." : "DOWNLOAD CV"}
              </span>
            </motion.button>
          )}
        </motion.div>

        {/* Center Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
        >
        </motion.div>

        {/* Bottom Right - Description */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="self-end text-right max-w-md"
        >
          <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-2">01 — ABOUT</p>
          <p className="font-sans text-lg md:text-xl font-light leading-relaxed text-white/90">
            {initialBiodata?.description || "Deskripsi belum diatur."}
          </p>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  )
}
