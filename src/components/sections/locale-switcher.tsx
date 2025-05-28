'use client';

import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useState } from 'react';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isHovered, setIsHovered] = useState(false);

  const toggleLanguage = () => {
    const newLocale = locale === 'pt-BR' ? 'en' : 'pt-BR';
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <motion.div
      className="fixed top-6 right-6 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        onClick={toggleLanguage}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center gap-2 bg-black/80 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Ícone do globo */}
        <motion.div
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 0.5 }}
          className="w-5 h-5"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </svg>
        </motion.div>

        {/* Texto do idioma atual */}
        <span className="text-sm font-medium uppercase tracking-wider">
          {locale === 'pt-BR' ? 'PT-BR' : 'EN'}
        </span>

        {/* Seta indicativa */}
        <motion.div
          animate={{ rotate: isHovered ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-3 h-3"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </motion.div>

        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ 
            opacity: isHovered ? 1 : 0, 
            y: isHovered ? -8 : -10 
          }}
          transition={{ duration: 0.2 }}
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-3 py-1 rounded-md whitespace-nowrap pointer-events-none"
        >
          {locale === 'pt-BR' ? 'Switch to English' : 'Mudar para Português'}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
        </motion.div>
      </motion.button>

      {/* Efeito de partículas no hover */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 pointer-events-none"
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/60 rounded-full"
              initial={{ 
                x: 20, 
                y: 15, 
                opacity: 0 
              }}
              animate={{
                x: 20 + Math.cos(i * 60 * Math.PI / 180) * 30,
                y: 15 + Math.sin(i * 60 * Math.PI / 180) * 30,
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}