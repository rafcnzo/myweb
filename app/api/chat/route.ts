import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl || "", supabaseKey || "")

async function getPortfolioContext() {
  try {
    const { data: biodata } = await supabase
      .from("biodata")
      .select("*")
      .limit(1)
      .single()

    const { data: projects } = await supabase
      .from("projects")
      .select("*")
      .limit(5)
      .order("created_at", { ascending: false })

    const { data: skills } = await supabase
      .from("skills")
      .select("*")

    const { data: experiences } = await supabase
      .from("experiences")
      .select("*")
      .limit(5)
      .order("start_date", { ascending: false })

    return { biodata, projects, skills, experiences }
  } catch (error) {
    console.error("Supabase Context Error:", error)
    return { biodata: null, projects: [], skills: [], experiences: [] }
  }
}

function buildSystemPrompt(context: any): string {
  const { biodata, projects, skills, experiences } = context

  let prompt = `You are an AI assistant representing a professional developer portfolio.`

  if (biodata) {
    prompt += `

About the portfolio owner:
- Name: ${biodata.name}
- Role: ${biodata.role}
- Description: ${biodata.description}
- Email: ${biodata.email || "Not provided"}
- GitHub: ${biodata.github_url || "Not provided"}
- LinkedIn: ${biodata.linkedin_url || "Not provided"}`
  }

  if (experiences?.length) {
    prompt += `

Professional Experience:`
    experiences.forEach((exp: any) => {
      prompt += `
- ${exp.title} at ${exp.company} (${exp.start_date} to ${exp.end_date}): ${exp.description}`
    })
  }

  if (projects?.length) {
    prompt += `

Recent Projects:`
    projects.forEach((proj: any) => {
      prompt += `
- ${proj.title} (${proj.category}): Status - ${proj.status}`
    })
  }

  if (skills?.length) {
    const skillsByCategory = skills.reduce((acc: any, skill: any) => {
      if (!acc[skill.category]) acc[skill.category] = []
      acc[skill.category].push(`${skill.name} (${skill.percentage}%)`)
      return acc
    }, {})

    prompt += `

Skills:`
    Object.entries(skillsByCategory).forEach(([category, list]: any) => {
      prompt += `
- ${category}: ${list.join(", ")}`
    })
  }

  prompt += `

Your job:
- Help visitors understand the developer's projects, skills, and experience
- Be professional and concise (2-4 sentences)
- Answer only based on provided portfolio data
- If unsure, say you don't have that information`

  return prompt
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    if (!message) {
      return NextResponse.json(
        { reply: "Message is required" },
        { status: 400 }
      )
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { reply: "OPENROUTER_API_KEY belum diset di .env.local" },
        { status: 500 }
      )
    }

    const context = await getPortfolioContext()
    const systemPrompt = buildSystemPrompt(context)

    const openRouterResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Portfolio AI Chatbot",
        },
        body: JSON.stringify({
          model: "nvidia/nemotron-3-nano-30b-a3b:free",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: message,
            },
          ],
          temperature: 0.7,
          max_tokens: 400,
        }),
      }
    )

    const rawText = await openRouterResponse.text()

    if (!openRouterResponse.ok) {
      console.error("OpenRouter FULL ERROR:", rawText)
      return NextResponse.json(
        { reply: "AI API Error: " + rawText },
        { status: 500 }
      )
    }

    const data = JSON.parse(rawText)

    const reply =
      data?.choices?.[0]?.message?.content ||
      "AI tidak memberikan respon."

    return NextResponse.json({ reply })
  } catch (error: any) {
    console.error("CHATBOT SERVER ERROR:", error)
    return NextResponse.json(
      { reply: "Server Error: " + error.message },
      { status: 500 }
    )
  }
}