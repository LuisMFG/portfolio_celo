"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function AboutSection() {
  const t = useTranslations("AboutSection");

  return (
    <section
      id="about"
      className="min-h-screen snap-start flex items-center p-8"
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto"
      >
        <h2 className="text-3xl font-bold mb-8">{t("title")}</h2>
        <p className="text-lg text-muted-foreground mb-6">{t("paragraph1")}</p>
        <p className="text-lg text-muted-foreground">{t("paragraph2")}</p>
      </motion.div>
    </section>
  );
}
