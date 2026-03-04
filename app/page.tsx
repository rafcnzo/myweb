import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Works } from "@/components/works"
import { TechMarquee } from "@/components/tech-marquee"
import { Footer } from "@/components/footer"
import { CustomCursor } from "@/components/custom-cursor"
import { SmoothScroll } from "@/components/smooth-scroll"
import { Chatbot } from "@/components/chatbot"
import { SectionBlend } from "@/components/section-blend"
import { getBiodata, getExperiences, getProjects, supabase } from "@/lib/supabase"
import { GithubRepos, type Repo } from "@/components/github-repos"


async function getGithubRepos(username: string): Promise<Repo[]> {
  try {
    // 1. Tarik banyak repo sekaligus (misal 100 repo) agar semua repomu terbaca
    const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
      next: { revalidate: 3600 } 
    });
    
    if (!res.ok) return [];
    const allRepos: Repo[] = await res.json();

    // =====================================================================
    // 2. TULIS NAMA REPOSITORY PILIHANMU DI SINI (Harus sama persis huruf besar/kecilnya)
    // =====================================================================
    const selectedRepoNames = [
      "hospitals",
      "whs",
      "deteksi-rambu",
      "blog",
      "nikenps",
      "dishop"
    ];

    const filteredRepos = allRepos.filter((repo) => 
      selectedRepoNames.includes(repo.name)
    );

    filteredRepos.sort((a, b) => {
      return selectedRepoNames.indexOf(a.name) - selectedRepoNames.indexOf(b.name);
    });

    return filteredRepos;

  } catch (error) {
    console.error("Gagal menarik data GitHub:", error);
    return [];
  }
}

export default async function Home() {
  const GITHUB_USERNAME = "rafcnzo";
  const [biodata, experiences, projects, { data: settings }, githubRepos] = await Promise.all([
    getBiodata(),
    getExperiences(),
    getProjects(),
    supabase.from("site_settings").select("title").eq("id", 1).single(),
    getGithubRepos(GITHUB_USERNAME)
  ])

  return (
    <SmoothScroll>
      <CustomCursor />
      <Chatbot />
      {/* Lempar title ke Navbar! */}
      <Navbar siteTitle={settings?.title} />
      <main>
        <Hero initialBiodata={biodata} />
        <SectionBlend />
        <About initialExperiences={experiences} />
        <Works initialProjects={projects} />
        <TechMarquee />
        <GithubRepos repos={githubRepos} />
        <Footer />
      </main>
    </SmoothScroll>
  )
}