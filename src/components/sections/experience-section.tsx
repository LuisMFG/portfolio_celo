import { motion } from "framer-motion";
import { Icons } from "@/src/components/icons";
import { experiences } from "@/src/data/experiences";

// Interface para tipagem das experiências
interface Experience {
  id: string;
  type: "professional" | "academic";
  title: string;
  company: string;
  period: string;
  description: string;
}

export function ExperienceSection() {
  const professionalExperiences: Experience[] = experiences.filter(
    (exp: Experience) => exp.type === "professional"
  );

  const academicExperiences: Experience[] = experiences.filter(
    (exp: Experience) => exp.type === "academic"
  );

  return (
    <section
      id="experience"
      className="min-h-screen snap-start flex items-center p-8"
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto w-full"
      >
        <h2 className="text-3xl font-bold mb-12 text-center">
          Experiências <Icons />
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Experiência Profissional */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-semibold text-primary mb-6">
              Profissional
            </h3>

            <div className="space-y-8">
              {professionalExperiences.map((exp: Experience) => (
                <div key={exp.id} className="border-l-2 border-primary pl-6">
                  <h4 className="text-xl font-semibold">{exp.title}</h4>
                  <p className="text-muted-foreground mb-2">
                    {exp.company} • {exp.period}
                  </p>
                  <p className="text-muted-foreground">{exp.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Experiência Acadêmica */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-semibold text-primary mb-6">
              Acadêmica
            </h3>

            <div className="space-y-8">
              {academicExperiences.map((exp: Experience) => (
                <div key={exp.id} className="border-l-2 border-primary pl-6">
                  <h4 className="text-xl font-semibold">{exp.title}</h4>
                  <p className="text-muted-foreground mb-2">
                    {exp.company} • {exp.period}
                  </p>
                  <p className="text-muted-foreground">{exp.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
