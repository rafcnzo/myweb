"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { getSkills, type Skill } from "@/lib/supabase"

export function TechMarquee() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  useEffect(() => {
    async function loadSkills() {
      const data = await getSkills()
      setSkills(data)
      setLoading(false)
    }
    loadSkills()
  }, [])

  // Group skills by category
  const groupedSkills = skills.reduce(
    (acc, skill) => {
      const category = skill.category || "Other"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(skill)
      return acc
    },
    {} as Record<string, Skill[]>
  )

  const categories = Object.entries(groupedSkills)

  // Set default active category once loaded
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0][0])
    }
  }, [categories.length])

  const activeSkills = activeCategory ? (groupedSkills[activeCategory] ?? []) : []

  return (
    <section id="skills" className="relative">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="px-8 md:px-12 mb-12"
      >
        <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-4">
          04 — SOFT AND HARD SKILLS
        </p>
        <h3 className="font-sans text-2xl md:text-3xl font-light">Core Competencies</h3>
      </motion.div>

      {!loading && categories.length > 0 ? (
        <div className="px-8 md:px-12">
          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap gap-2 mb-10"
          >
            {categories.map(([category], index) => (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="relative font-mono text-xs tracking-[0.2em] uppercase px-5 py-2.5 rounded-full border transition-colors duration-300"
                style={{
                  borderColor:
                    activeCategory === category
                      ? "rgba(37,99,235,0.8)"
                      : "rgba(255,255,255,0.1)",
                  color:
                    activeCategory === category
                      ? "rgba(255,255,255,1)"
                      : "rgba(255,255,255,0.45)",
                  background:
                    activeCategory === category
                      ? "rgba(37,99,235,0.15)"
                      : "transparent",
                }}
              >
                {activeCategory === category && (
                  <motion.span
                    layoutId="tab-highlight"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "rgba(37,99,235,0.12)",
                      border: "1px solid rgba(37,99,235,0.6)",
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{category}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Skills Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="space-y-5"
            >
              {activeSkills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onMouseEnter={() => setHoveredId(skill.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group cursor-default"
                >
                  {/* Skill Name and Percentage */}
                  <div className="flex items-center justify-between mb-2">
                    <motion.h5
                      className="font-sans text-base md:text-lg font-light tracking-tight"
                      animate={{
                        color:
                          hoveredId === skill.id
                            ? "rgba(255,255,255,1)"
                            : "rgba(255,255,255,0.9)",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {skill.name}
                    </motion.h5>
                    <motion.span
                      className="font-mono text-sm tracking-widest"
                      animate={{
                        color:
                          hoveredId === skill.id
                            ? "rgba(37,99,235,1)"
                            : "rgba(255,255,255,0.5)",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {skill.percentage}%
                    </motion.span>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative w-full h-1 bg-white/10 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#2563eb] to-[#2563eb]/60 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.percentage}%` }}
                      transition={{
                        duration: 1.2,
                        delay: index * 0.05,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                      style={{
                        boxShadow:
                          hoveredId === skill.id
                            ? "0 0 20px rgba(37,99,235,0.8)"
                            : "0 0 0px rgba(37,99,235,0)",
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <div className="px-8 md:px-12 text-center py-8">
          <p className="font-mono text-xs tracking-widest text-muted-foreground">
            {loading ? "LOADING SKILLS..." : "NO SKILLS FOUND"}
          </p>
        </div>
      )}

      {/* Bottom Border */}
      <div className="border-t border-white/10 mt-24" />
    </section>
  )
}