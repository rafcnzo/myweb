"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { Project } from "@/lib/supabase"

// --- TAMBAHAN: Helper untuk mengekstrak URL gambar pertama dengan aman ---
const getFirstImage = (imagePath: string | null | undefined): string | null => {
  if (!imagePath) return null;
  
  try {
    // Coba parse string JSON menjadi Array
    const parsed = JSON.parse(imagePath);
    // Jika bentuknya array dan ada isinya, ambil index ke-0
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed[0];
    }
    return null;
  } catch (error) {
    // Fallback: Jika error saat di-parse (mungkin datanya cuma 1 link biasa tanpa kurung siku)
    if (imagePath.startsWith("http")) return imagePath;
    return null;
  }
}

export function Works({ initialProjects }: { initialProjects: Project[] }) {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const getYear = (dateString: string) => {
    return new Date(dateString).getFullYear().toString()
  }

  return (
    <section id="works" className="relative py-2 px-8 md:px-12 md:py-2">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-24"
      >
        <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-4">03 — SELECTED WORKS</p>
        <h2 className="font-sans text-3xl md:text-5xl font-light italic">Portfolio & Projects</h2>
      </motion.div>

      {/* Projects Grid */}
      {initialProjects && initialProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {initialProjects.map((project, index) => {
            // EKSTRAK GAMBAR SEBELUM DI-RENDER
            const coverImage = getFirstImage(project.image_path);

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group cursor-pointer"
              >
                {/* Project Card */}
                <div className="space-y-4">
                  {/* Image Container */}
                  {/* Gunakan coverImage yang sudah di-parse, bukan project.image_path mentah */}
                  {coverImage && (
                    <motion.div
                      className="relative w-full aspect-video overflow-hidden rounded-lg border border-white/10"
                      animate={{
                        borderColor: hoveredId === project.id ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.img
                        src={coverImage} // <--- URL BERSIH MASUK KE SINI
                        alt={project.title}
                        className="w-full h-full object-cover"
                        animate={{
                          scale: hoveredId === project.id ? 1.05 : 1,
                        }}
                        transition={{ duration: 0.4 }}
                        style={{
                          filter: hoveredId === project.id ? "grayscale(0%) contrast(1.1)" : "grayscale(50%) contrast(1)",
                        }}
                      />
                      {/* Overlay */}
                      <motion.div
                        className="absolute inset-0 bg-[#2563eb]/10 mix-blend-overlay"
                        animate={{
                          opacity: hoveredId === project.id ? 0.15 : 0.05,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                  )}

                  {/* Content */}
                  <div className="space-y-3">
                    {/* Year & Title */}
                    <div>
                      <motion.p
                        className="font-mono text-xs text-muted-foreground tracking-widest mb-2"
                        animate={{
                          color: hoveredId === project.id ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.5)",
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {getYear(project.created_at)} — PROJECT
                      </motion.p>
                      <motion.h3
                        className="font-sans text-2xl md:text-3xl font-light tracking-tight"
                        animate={{
                          x: hoveredId === project.id ? 8 : 0,
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        {project.title}
                      </motion.h3>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2 flex-wrap pt-2">
                      {project.category && (
                        <motion.span
                          className="font-mono text-[10px] tracking-wider px-3 py-1 border border-white/20 rounded-full text-muted-foreground"
                          animate={{
                            borderColor: hoveredId === project.id ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.2)",
                            color: hoveredId === project.id ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {project.category}
                        </motion.span>
                      )}
                      {project.status && (
                        <motion.span
                          className="font-mono text-[10px] tracking-wider px-3 py-1 border border-white/20 rounded-full text-muted-foreground"
                          animate={{
                            borderColor: hoveredId === project.id ? "rgba(37,99,235,0.6)" : "rgba(255,255,255,0.2)",
                            color: hoveredId === project.id ? "rgba(37,99,235,1)" : "rgba(255,255,255,0.5)",
                            backgroundColor: hoveredId === project.id ? "rgba(37,99,235,0.1)" : "transparent",
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {project.status}
                        </motion.span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="font-mono text-xs tracking-widest text-muted-foreground">
            NO PROJECTS FOUND
          </p>
        </div>
      )}

      {/* Bottom Border */}
      <div className="border-t border-white/10 mt-24" />
    </section>
  )
}