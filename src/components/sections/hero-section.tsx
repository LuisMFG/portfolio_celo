"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/src/components/sections/locale-switcher";

export function HeroSection() {
  const t = useTranslations("HeroSection");

  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const fullText = t("greeting");

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => setShowCursor(false), 1000);
      }
    }, 100);

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, [fullText]);

  return (
    <section
      id="home"
      className="min-h-screen snap-start flex items-center justify-center p-8 relative"
    >
      {/* Switcher fixo no canto superior direito no mobile */}
      <div className="absolute top-4 right-4 block md:hidden z-50">
        <LanguageSwitcher />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl text-center"
      >
        <div className="relative w-48 h-48 mx-auto mb-8">
          <Image
            src="/images/pfp_luismarcelo.jpeg"
            alt={t("alt")}
            fill
            className="rounded-full object-cover border-4 border-primary"
          />
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-4 min-h-[1.2em]">
          {displayedText}
          <span
            className={`inline-block w-1 h-[1em] bg-primary ml-1 ${
              showCursor ? "opacity-100" : "opacity-0"
            } transition-opacity duration-100`}
          />
        </h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.8 }}
          className="text-2xl md:text-3xl text-muted-foreground mb-8"
        >
          {t("subtitle")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 0.8 }}
          className="text-lg text-muted-foreground"
        >
          {t("description")}
        </motion.p>
      </motion.div>
    </section>
  );
}
