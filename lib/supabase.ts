import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types
export interface Biodata {
  id: number
  name: string
  role: string
  description: string
  telepon?: string
  email?: string
  github_url?: string
  linkedin_url?: string
  cv_path?: string
  created_at: string
  updated_at?: string
}

export interface Experience {
  id: number
  title: string
  company: string
  start_date: string
  end_date: string
  description: string
  type: string
  created_at: string
  updated_at?: string
}

export interface Project {
  id: number
  title: string
  category: string
  status: string
  image_path: string
  created_at: string
}

export interface Skill {
  id: number
  name: string
  category: string
  percentage: number
  created_at: string
  updated_at?: string
}

export interface Message {
  id: number
  name: string
  email: string
  message: string
  is_read: boolean
  created_at: string
}

// Fetch functions
export async function getBiodata(): Promise<Biodata | null> {
  const { data, error } = await supabase.from("biodata").select("*").limit(1).single()
  if (error) {
    console.error("Error fetching biodata:", error)
    return null
  }
  return data
}

export async function getExperiences(): Promise<Experience[]> {
  const { data, error } = await supabase.from("experiences").select("*").order("start_date", { ascending: false })
  if (error) {
    console.error("Error fetching experiences:", error)
    return []
  }
  return data || []
}

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })
  if (error) {
    console.error("Error fetching projects:", error)
    return []
  }
  return data || []
}

export async function getSkills(): Promise<Skill[]> {
  // Menarik data skills, urutkan descending (yang paling jago/progress besar di atas)
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("percentage", { ascending: false })
  if (error) {
    console.error("Error fetching skills:", error)
    return []
  }
  return data || []
}

export async function saveMessage(name: string, email: string, message: string): Promise<{ success: boolean; error?: any }> {
  const { error } = await supabase
    .from("messages")
    .insert([{ name, email, message, is_read: false }])

  if (error) {
    console.error("Error saving message:", error)
    return { success: false, error }
  }
  
  return { success: true }
}
