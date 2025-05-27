import { motion } from "framer-motion";
import { ProjectCard } from "@/src/components/ui/project-card";
import { projects } from "@/src/data/projects";

export function ProjectsSection() {
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
        <h2 className="text-3xl font-bold mb-12 text-center">Projetos</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
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
