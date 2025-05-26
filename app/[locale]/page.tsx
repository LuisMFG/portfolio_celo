"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { LoadingScreen } from "@/components/loadingscreen";
import { Sidebar } from "@/components/sidebar";
import { ParticlesBackground } from "@/components/particles-background";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { ProjectsSection } from "@/components/sections/projects-section";

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
