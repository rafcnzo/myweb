import { NextResponse } from "next/server"

export async function GET() {
  try {
    const res = await fetch("https://zenquotes.io/api/random", {
      next: { revalidate: 0 },
    })
    if (!res.ok) throw new Error(`ZenQuotes ${res.status}`)
    const data = await res.json()
    const q = data[0]
    return NextResponse.json({ content: q.q, author: q.a })
  } catch {
    return NextResponse.json({
      content: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
    })
  }
}