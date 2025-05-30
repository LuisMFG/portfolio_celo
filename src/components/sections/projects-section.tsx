"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ProjectCard } from "@/src/components/ui/project-card";
import { projects } from "@/src/data/projects";

export function ProjectsSection() {
  const t = useTranslations("ProjectsSection");

  return (
    <section
      id="projects"
      className="min-h-screen snap-start flex items-center p-8"
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto w-full"
      >
        <h2 className="text-3xl font-bold mb-12 text-center">{t("title")}</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              title={t(`items.${project.id}.title`)}
              description={t(`items.${project.id}.description`)}
              image={project.image}
              technologies={project.technologies}
              githubUrl={project.githubUrl}
              liveUrl={project.liveUrl}
              delay={index * 0.1}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
