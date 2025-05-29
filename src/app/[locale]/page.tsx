// src/app/[locale]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { LoadingScreen } from "@/src/components/loadingscreen";
import { Sidebar } from "@/src/components/sidebar";
import { ParticlesBackground } from "@/src/components/particles-background";
import { HeroSection } from "@/src/components/sections/hero-section";
import { AboutSection } from "@/src/components/sections/about-section";
import { SkillsSection } from "@/src/components/sections/skills-section";
import { ExperienceSection } from "@/src/components/sections/experience-section";
import { ProjectsSection } from "@/src/components/sections/projects-section";
import { LanguageSwitcher } from "@/src/components/sections/locale-switcher";
import { ContactSection } from "@/src/components/sections/contact-section";

export default function Home() {
  const [loading, setLoading] = useState(() => {
    if (typeof window === "undefined") return false;
    // se já teve loader nessa sessão, não mostra de novo
    return !sessionStorage.getItem("hasShownLoading");
  });

  useEffect(() => {
    if (!loading) return;

    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem("hasShownLoading", "true");
    }, 2000);

    return () => clearTimeout(timer);
  }, [loading]);

  if (loading) return <LoadingScreen />;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ParticlesBackground />
      <Sidebar />
      <LanguageSwitcher />

      <div className="pl-16 md:pl-20 h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ExperienceSection />
        <ProjectsSection />
        <ContactSection />
      </div>
    </main>
  );
}
