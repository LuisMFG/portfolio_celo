// src/app/[locale]/page.tsx
"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { LoadingScreen } from "@/src/components/loadingscreen";
import { Sidebar } from "@/src/components/sidebar";
import { ParticlesBackground } from "@/src/components/particles-background";
import { HeroSection } from "@/src/components/sections/hero-section";
import { AboutSection } from "@/src/components/sections/about-section";
import { SkillsSection } from "@/src/components/sections/skills-section";
import { ExperienceSection } from "@/src/components/sections/experience-section";
import { ProjectsSection } from "@/src/components/sections/projects-section";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ParticlesBackground />
      <Sidebar />

      <div className="pl-16 md:pl-20 h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ExperienceSection />
        <ProjectsSection />
      </div>
    </main>
  );
}
