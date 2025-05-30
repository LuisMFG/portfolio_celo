"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Icons } from "@/src/components/icons";
import { experiences } from "@/src/data/experiences";

interface Experience {
  id: string;
  type: "professional" | "academic";
}

export function ExperienceSection() {
  const t = useTranslations("ExperienceSection");

  const professionalExperiences = experiences.filter(
    (exp: Experience) => exp.type === "professional"
  );
  const academicExperiences = experiences.filter(
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
          {t("title")} <Icons />
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-semibold text-primary mb-6">
              {t("professional")}
            </h3>

            <div className="space-y-8">
              {professionalExperiences.map((exp) => (
                <div key={exp.id} className="border-l-2 border-primary pl-6">
                  <h4 className="text-xl font-semibold">
                    {t(`items.${exp.id}.title`)}
                  </h4>
                  <p className="text-muted-foreground mb-2">
                    {t(`items.${exp.id}.company`)} •{" "}
                    {t(`items.${exp.id}.period`)}
                  </p>
                  <p className="text-muted-foreground">
                    {t(`items.${exp.id}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-semibold text-primary mb-6">
              {t("academic")}
            </h3>

            <div className="space-y-8">
              {academicExperiences.map((exp) => (
                <div key={exp.id} className="border-l-2 border-primary pl-6">
                  <h4 className="text-xl font-semibold">
                    {t(`items.${exp.id}.title`)}
                  </h4>
                  <p className="text-muted-foreground mb-2">
                    {t(`items.${exp.id}.company`)} •{" "}
                    {t(`items.${exp.id}.period`)}
                  </p>
                  <p className="text-muted-foreground">
                    {t(`items.${exp.id}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
