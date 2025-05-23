import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  delay?: number;
}

export function ProjectCard({
  title,
  description,
  image,
  technologies,
  githubUrl,
  liveUrl,
  delay = 0,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-card p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-white/10 hover:border-primary h-full flex flex-col"
    >
      {/* Imagem - altura fixa */}
      <div className="overflow-hidden rounded-lg mb-4 h-48 flex-shrink-0 bg-muted/20">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-contain rounded-lg transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Título - altura fixa */}
      <div className="h-14 flex items-start mb-2">
        <h3 className="text-xl font-semibold line-clamp-2">{title}</h3>
      </div>

      {/* Descrição - cresce conforme necessário mas com altura mínima */}
      <div className="flex-grow mb-4">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>

      {/* Tecnologias - altura flexível mas consistente */}
      <div className="flex flex-wrap gap-2 mb-6 min-h-[2.5rem]">
        {technologies.map((tech) => (
          <span
            key={tech}
            className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm h-fit"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Botões - sempre no final */}
      <div className="flex gap-2 mt-auto flex-shrink-0">
        {githubUrl && (
          <Button asChild variant="outline" size="sm" className="flex-1">
            <a href={githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </a>
          </Button>
        )}

        {liveUrl && (
          <Button asChild variant="outline" size="sm" className="flex-1">
            <a href={liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Visualizar página
            </a>
          </Button>
        )}
      </div>
    </motion.div>
  );
}
