import { motion } from "framer-motion";
import { technologies } from "@/components/technologies";

export function SkillsSection() {
  return (
    <section
      id="skills"
      className="min-h-screen snap-start flex items-center p-8"
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto w-full"
      >
        <h2 className="text-3xl font-bold mb-12 text-center">Tecnologias</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{
                opacity: {
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeInOut",
                },
                scale: { type: "spring", stiffness: 100, damping: 12 },
              }}
              className="flex flex-col items-center gap-3 p-4 rounded-xl bg-card hover:bg-accent transition-colors"
            >
              <div className="text-foreground">{tech.icon}</div>
              <span className="text-sm font-medium">{tech.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
