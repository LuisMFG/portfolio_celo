import { motion } from "framer-motion";

export function AboutSection() {
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
        <h2 className="text-3xl font-bold mb-8">Sobre Mim</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Entusiasta da tecnologia, apaixonado por programação e infraestrutura
          de TI. Atualmente, sou estagiário em Desenvolvimento Full Stack na
          CGE/RO, atuando no Núcleo de Inovação e Prevenção à Corrupção.
        </p>
        <p className="text-lg text-muted-foreground">
          Estou sempre em busca de aprimorar minhas habilidades e contribuir com
          soluções inovadoras, unindo conhecimento acadêmico à experiência
          prática para enfrentar desafios e criar impacto positivo.
        </p>
      </motion.div>
    </section>
  );
}
