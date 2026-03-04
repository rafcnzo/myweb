import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Playfair_Display, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { TerminalLoader } from "@/components/terminal-loader";
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export async function generateMetadata(): Promise<Metadata> {
  if (!supabase) {
    // fallback if env not set or supabase is null
    return {
      title: "Personal Portfolio",
      description: "Explore my work, experience, and projects",
      icons: {
        icon: "/favicon.ico",
      },
      generator: "v0.app",
    };
  }

  const { data: settings } = await supabase
    .from("site_settings")
    .select("title, favicon_url")
    .eq("id", 1)
    .single();

  return {
    title: settings?.title || "Personal Portfolio",
    description: "Explore my work, experience, and projects",
    icons: {
      icon: settings?.favicon_url || "/favicon.ico",
    },
    generator: "v0.app",
  };
}

export const viewport: Viewport = {
  themeColor: "#1a1a1a",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased overflow-x-hidden">
        <TerminalLoader />
        <div className="noise-overlay" />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
