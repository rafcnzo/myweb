"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Download, ArrowDown } from "lucide-react"
import { SentientSphere } from "./sentient-sphere"
import type { Biodata } from "@/lib/supabase"

// ─── Typing Animation Hook ─────────────────────────────────────────────────────

function useTypingAnimation(words: string[], speed = 80, pause = 2000) {
  const [displayed, setDisplayed] = useState("")
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!words.length) return
    const current = words[wordIndex % words.length]

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayed(current.slice(0, charIndex + 1))
        if (charIndex + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), pause)
        } else {
          setCharIndex((c) => c + 1)
        }
      } else {
        setDisplayed(current.slice(0, charIndex - 1))
        if (charIndex - 1 === 0) {
          setIsDeleting(false)
          setWordIndex((w) => (w + 1) % words.length)
          setCharIndex(0)
        } else {
          setCharIndex((c) => c - 1)
        }
      }
    }, isDeleting ? speed / 2 : speed)

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, wordIndex, words, speed, pause])

  return displayed
}

// ─── Grain Overlay ─────────────────────────────────────────────────────────────

function GrainOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-1 opacity-[0.035]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
        mixBlendMode: "overlay",
      }}
    />
  )
}

// ─── Cursor Blink ──────────────────────────────────────────────────────────────

function Cursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 0.9, repeat: Infinity, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="inline-block w-[2px] h-[0.85em] bg-white/70 ml-1 align-middle"
    />
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function Hero({ initialBiodata }: { initialBiodata: Biodata | null }) {
  const containerRef = useRef<HTMLElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  // ── Role typing animation ──────────────────────────────────────────────────

  // Build role variants from biodata, or fall back to defaults
  const roleParts = initialBiodata?.role?.split(" ") || ["SYSTEM", "ARCHITECT"]
  const lastWord = roleParts[roleParts.length - 1] || ""
  const firstWords = roleParts.slice(0, -1).join(" ") || ""

  // Typing cycles through the italic last word + a couple alternatives
  const typingWords = [lastWord, "Developer", "Builder"].filter(Boolean)
  const typedWord = useTypingAnimation(typingWords, 75, 2200)

  // ── CV Download ────────────────────────────────────────────────────────────

  const handleDownloadCV = async () => {
    if (!initialBiodata?.cv_path) {
      alert("CV tidak tersedia untuk diunduh")
      return
    }
    setIsDownloading(true)
    try {
      const response = await fetch(initialBiodata.cv_path)
      if (!response.ok) throw new Error("Failed to download")
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
    <section
      id="about"
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-[#050505]"
    >
      {/* Grain texture */}
      <GrainOverlay />

      {/* Sphere */}
      <div className="absolute inset-0 z-0">
        <SentientSphere />
      </div>

      {/* Radial vignette for depth */}
      <div
        className="pointer-events-none absolute inset-0 z-2"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(5,5,5,0.6) 100%)",
        }}
      />

      {/* Main content */}
      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 h-full flex flex-col justify-between pt-32 md:pt-20 pb-8 px-8 md:px-12 md:py-20"
      >
        {/* ── Top Left: Name + Role ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-2">
            {initialBiodata?.name?.toUpperCase() || "SYSTEM USER"}
          </p>
          <h2 className="font-sans text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-balance">
            {firstWords}
            <br />
            <span className="italic">
              {typedWord}
              <Cursor />
            </span>
          </h2>
        </motion.div>

        {/* ── Bottom Right: Description ── */}
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

      {/* ── Scroll Indicator + CV CTA ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
      >
        {/* CV download — subtle text link */}
        {initialBiodata?.cv_path && (
          <motion.button
            onClick={handleDownloadCV}
            disabled={isDownloading}
            className="group flex items-center gap-1.5 font-mono text-[10px] tracking-[0.25em] text-muted-foreground hover:text-white transition-colors duration-300 disabled:opacity-40 uppercase"
            whileHover={{ y: -1 }}
          >
            <AnimatePresence mode="wait">
              {isDownloading ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="inline-block"
                  >
                    ↻
                  </motion.span>
                  Downloading...
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <Download className="w-3 h-3 group-hover:translate-y-0.5 transition-transform duration-300" />
                  Download CV
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )}

        {/* Divider */}
        <div className="w-px h-4 bg-white/10" />

        {/* Scroll bounce */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            Scroll
          </span>
          <div className="w-px h-8 bg-linear-gradient(to bottom, white/40, transparent)" />
        </motion.div>
      </motion.div>
    </section>
  )
}