import { Navbar } from '@/components/Navbar'
import { HeroSection } from '@/components/HeroSection'
import { ExperienceSection } from '@/components/ExperienceSection'
import { EducationSection } from '@/components/EducationSection'
import { SkillsSection } from '@/components/SkillsSection'
import { CertificationsSection } from '@/components/CertificationsSection'
import { ProjectsSection } from '@/components/ProjectsSection'
import { PublicationsSection } from '@/components/PublicationsSection'
import { ContactSection } from '@/components/ContactSection'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900">
      <Navbar />
      <HeroSection />
      <ExperienceSection />
      <EducationSection />
      <SkillsSection />
      <CertificationsSection />
      <ProjectsSection />
      <PublicationsSection />
      <ContactSection />

      <footer className="bg-slate-950 text-slate-400 py-8 text-center text-sm">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} Mahad Qasim. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
