"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import type { Experience } from "@/lib/supabase"

// Terima props dari page.tsx
export function About({ initialExperiences }: { initialExperiences: Experience[] }) {
  const containerRef = useRef<HTMLElement>(null)

  return (
    <section id="experience" ref={containerRef} className="relative py-2 overflow-hidden md:py-2">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="px-8 md:px-12 mb-12"
      >
        <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-4">02 — EXPERIENCE</p>
        <h2 className="font-sans text-3xl md:text-5xl font-light italic">Journey & Milestones</h2>
      </motion.div>

      {/* Experiences Timeline */}
      <div className="px-8 md:px-12 space-y-8">
        {initialExperiences && initialExperiences.length > 0 ? (
          initialExperiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="border-l-2 border-white/20 pl-6 py-4"
            >
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-sans text-2xl md:text-3xl font-light tracking-tight text-white mb-1">
                    {exp.title}
                  </h3>
                  <p className="font-mono text-sm tracking-[0.2em] text-muted-foreground mb-2">
                    {exp.company} • {exp.type?.toUpperCase()}
                  </p>
                  <p className="font-sans text-base font-light leading-relaxed text-white/70">
                    {exp.description}
                  </p>
                </div>
                <div className="md:text-right">
                  <p className="font-mono text-xs tracking-widest text-muted-foreground">
                    {exp.start_date} — {exp.end_date}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="font-mono text-xs tracking-widest text-muted-foreground">
              NO EXPERIENCES FOUND
            </p>
          </div>
        )}
      </div>

      {/* Decorative Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mt-16 mx-8 md:mx-12 h-px bg-linear-gradient(to right, transparent, white/20, transparent)"
      />
    </section>
  )
}