import { motion } from "framer-motion";
import Image from "next/image";

export function HeroSection() {
  return (
    <section
      id="home"
      className="min-h-screen snap-start flex items-center justify-center p-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl text-center"
      >
        <div className="relative w-48 h-48 mx-auto mb-8">
          <Image
            src="/images/pfp_luismarcelo.jpeg"
            alt="Luis Marcelo"
            fill
            className="rounded-full object-cover border-4 border-primary"
          />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Oi, eu sou Luis Marcelo!
        </h1>
        <h2 className="text-2xl md:text-3xl text-muted-foreground mb-8">
          Desenvolvedor Full Stack
        </h2>
        <p className="text-lg text-muted-foreground">
          Transformando ideias em soluções digitais inovadoras
        </p>
      </motion.div>
    </section>
  );
}
