"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { getBiodata, saveMessage, type Biodata } from "@/lib/supabase"

export function Footer() {
  const [time, setTime] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [biodata, setBiodata] = useState<Biodata | null>(null)
  const [loading, setLoading] = useState(true)

  // Form state
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [formLoading, setFormLoading] = useState(false)
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">("idle")

  useEffect(() => {
    async function loadBiodata() {
      const data = await getBiodata()
      setBiodata(data)
      setLoading(false)
    }
    loadBiodata()
  }, [])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, "0")
      const minutes = now.getMinutes().toString().padStart(2, "0")
      const seconds = now.getSeconds().toString().padStart(2, "0")
      const milliseconds = now.getMilliseconds().toString().padStart(3, "0")
      setTime(`${hours}:${minutes}:${seconds}.${milliseconds}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 10)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setFormStatus("idle")

    const result = await saveMessage(formData.name, formData.email, formData.message)

    if (result) {
      setFormStatus("success")
      setFormData({ name: "", email: "", message: "" })
      setTimeout(() => {
        setFormStatus("idle")
        setShowForm(false)
      }, 2000)
    } else {
      setFormStatus("error")
      setTimeout(() => setFormStatus("idle"), 3000)
    }

    setFormLoading(false)
  }

  const githubUrl = biodata?.github_url || "#"
  const linkedinUrl = biodata?.linkedin_url || "#"

  const socialLinks = [
    { name: "LinkedIn", url: linkedinUrl },
    { name: "GitHub", url: githubUrl },
  ]

  return (
    <footer id="contact" className="relative">
      {/* Main CTA / Form Toggle */}
      <motion.button
        onClick={() => setShowForm(!showForm)}
        data-cursor-hover
        className="relative w-full block overflow-hidden bg-transparent border-none"
      >
        {/* Background Curtain */}
        <motion.div
          className="absolute inset-0 bg-[#2563eb]"
          initial={{ y: "100%" }}
          animate={{ y: showForm ? "0%" : "100%" }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        {/* Content */}
        <div className="relative py-16 md:py-24 px-8 md:px-12 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <motion.h2
              className="font-sans text-4xl md:text-6xl lg:text-8xl font-light tracking-tight text-center md:text-left"
              animate={{
                color: showForm ? "#050505" : "#fafafa",
              }}
              transition={{ duration: 0.3 }}
            >
              Let's <span className="italic">Collaborate</span>
            </motion.h2>

            <motion.div
              animate={{
                rotate: showForm ? 45 : 0,
                color: showForm ? "#050505" : "#fafafa",
              }}
              transition={{ duration: 0.3 }}
            >
              <svg
                className="w-12 h-12 md:w-16 md:h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16V4m0 0L3 8m4-4l4 4M17 6v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </motion.div>
          </div>
        </div>
      </motion.button>

      {/* Contact Form */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: showForm ? "auto" : 0,
          opacity: showForm ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="overflow-hidden border-t border-white/10"
      >
        <div className="px-8 md:px-12 py-12 md:py-16">
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            {/* Name */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <label className="block font-mono text-xs tracking-[0.2em] text-muted-foreground mb-3">NAME</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 font-sans text-base text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors duration-300"
                placeholder="Your name"
              />
            </motion.div>

            {/* Email */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <label className="block font-mono text-xs tracking-[0.2em] text-muted-foreground mb-3">EMAIL</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 font-sans text-base text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors duration-300"
                placeholder="your@email.com"
              />
            </motion.div>

            {/* Message */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <label className="block font-mono text-xs tracking-[0.2em] text-muted-foreground mb-3">MESSAGE</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={5}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 font-sans text-base text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors duration-300 resize-none"
                placeholder="Your message here..."
              />
            </motion.div>

            {/* Status Messages */}
            {formStatus === "success" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-mono text-sm text-green-400 tracking-wider"
              >
                Message sent successfully!
              </motion.p>
            )}
            {formStatus === "error" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-mono text-sm text-red-400 tracking-wider"
              >
                Error sending message. Please try again.
              </motion.p>
            )}

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              type="submit"
              disabled={formLoading}
              className="w-full md:w-auto px-8 py-3 border border-white/30 rounded font-mono text-xs tracking-widest uppercase bg-white/5 hover:bg-white hover:text-black hover:border-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formLoading ? "SENDING..." : "SEND MESSAGE"}
            </motion.button>
          </form>
        </div>
      </motion.div>

      {/* Footer Info */}
      <div className="px-8 md:px-12 py-8 border-t border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Local Time */}
          <div className="font-mono text-xs tracking-widest text-muted-foreground">
            <span className="mr-2">LOCAL TIME</span>
            <span className="text-white tabular-nums">{time}</span>
          </div>

          {/* Social Links */}
          <div className="flex gap-8">
            {!loading && biodata
              ? socialLinks.map(
                  (link) =>
                    link.url !== "#" && (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor-hover
                        className="font-mono text-xs tracking-widest text-muted-foreground hover:text-white transition-colors duration-300"
                      >
                        {link.name}
                      </a>
                    )
                )
              : ["LinkedIn", "GitHub"].map((link) => (
                  <a
                    key={link}
                    href="#"
                    data-cursor-hover
                    className="font-mono text-xs tracking-widest text-muted-foreground hover:text-white transition-colors duration-300"
                  >
                    {link}
                  </a>
                ))}
          </div>

          {/* Copyright */}
          <p className="font-mono text-xs tracking-widest text-muted-foreground">© {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  )
}
