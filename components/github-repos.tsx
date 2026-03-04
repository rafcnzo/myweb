"use client"

import { motion } from "framer-motion"
import { Star, GitFork, Github, FolderGit2 } from "lucide-react"

// Tipe data dari API GitHub
export type Repo = {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
}

export function GithubRepos({ repos }: { repos: Repo[] }) {
  return (
    <section id="github" className="relative py-24 px-8 md:px-12 border-t border-white/5">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-4">05 — OPEN SOURCE</p>
        <h2 className="font-sans text-3xl md:text-5xl font-light italic flex items-center gap-4">
          GitHub Repositories <Github className="w-8 h-8 md:w-10 md:h-10 text-white/50" />
        </h2>
      </motion.div>

      {/* Repositories Grid */}
      {repos && repos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repos.map((repo, index) => (
            <motion.a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative flex flex-col justify-between p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-300"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <FolderGit2 className="w-5 h-5 text-blue-400 group-hover:text-blue-500 transition-colors" />
                  <h3 className="font-sans text-lg font-medium text-white group-hover:text-blue-400 transition-colors truncate">
                    {repo.name}
                  </h3>
                </div>
                <p className="font-sans text-sm font-light text-white/60 line-clamp-3 mb-6">
                  {repo.description || "Tidak ada deskripsi untuk repository ini."}
                </p>
              </div>

              {/* Bottom Stats */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5 font-mono text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  {repo.language && (
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      {repo.language}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 hover:text-white transition-colors">
                    <Star className="w-3.5 h-3.5" /> {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1 hover:text-white transition-colors">
                    <GitFork className="w-3.5 h-3.5" /> {repo.forks_count}
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="font-mono text-xs tracking-widest text-muted-foreground">
            TIDAK ADA REPOSITORY YANG DITEMUKAN
          </p>
        </div>
      )}
    </section>
  )
}