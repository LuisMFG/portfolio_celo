"use client"

import { useEffect, useState } from "react";
import { motion } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { ParticlesBackground } from "@/components/particles-background"
import Image from "next/image"
import { technologies } from "@/components/technologies"
import { LoadingScreen } from "@/components/loadingscreen";

import { Code2, Database, Globe2 } from "lucide-react"

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); 

    return () => clearTimeout(timer); 
  }, []);

  if (loading) {
    return <LoadingScreen />; 
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ParticlesBackground />
      <Sidebar />

      <div className="pl-16 md:pl-20 h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth">
        <section id="home" className="min-h-screen snap-start flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl text-center"
          >
            <div className="relative w-48 h-48 mx-auto mb-8">
              <Image
                src="\images\pfp_luismarcelo.jpeg"
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

        <section id="about" className="min-h-screen snap-start flex items-center p-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-8">Sobre Mim</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Entusiasta da tecnologia apaixonado por programação e infraestrutura de TI.
              Atualmente, sou estagiário em Desenvolvimento Full Stack na CGE/RO,
              atuando no Núcleo de Inovação e Prevenção à Corrupção.
            </p>
            <p className="text-lg text-muted-foreground">
              Estou sempre em busca de aprimorar minhas habilidades e contribuir com soluções inovadoras,
              unindo conhecimento acadêmico à experiência prática
              para enfrentar desafios e criar impacto positivo.
            </p>
          </motion.div>
        </section>

        <section id="skills" className="min-h-screen snap-start flex items-center p-8">
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
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 260,
                    damping: 20
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

        <section id="experience" className="min-h-screen snap-start flex items-center p-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-12">Experiência Profissional</h2>
            <div className="space-y-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="border-l-2 border-primary pl-6"
              >
                <h3 className="text-xl font-semibold">Estagiário de Desenvolvimento Full Stack</h3>
                <p className="text-muted-foreground mb-2">CGE/RO - Controladoria Geral do Estado de Rondônia • abr de 2025 - Presente</p>
                <p className="text-muted-foreground">
                  Desenvolvimento de aplicações web escaláveis, liderança técnica de equipe
                  e implementação de arquiteturas modernas.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="border-l-2 border-primary pl-6"
              >
                <h3 className="text-xl font-semibold">Estagiário de TI</h3>
                <p className="text-muted-foreground mb-2">CGE/RO - Controladoria Geral do Estado de Rondônia • out de 2024 - abr de 2025</p>
                <p className="text-muted-foreground">
                  Suporte e infraestrutura de TI
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        <section id="projects" className="min-h-screen snap-start flex items-center p-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto w-full"
          >
            <h2 className="text-3xl font-bold mb-12 text-center">Projetos</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-card p-6 rounded-lg"
              >
                <h3 className="text-xl font-semibold mb-4">E-commerce Platform</h3>
                <p className="text-muted-foreground mb-4">
                  Plataforma completa de e-commerce com sistema de pagamentos,
                  gestão de produtos e dashboard administrativo.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                    Next.js
                  </span>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                    Node.js
                  </span>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                    PostgreSQL
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-card p-6 rounded-lg"
              >
                <h3 className="text-xl font-semibold mb-4">Task Management App</h3>
                <p className="text-muted-foreground mb-4">
                  Aplicativo de gestão de tarefas com recursos de colaboração
                  em tempo real e integração com calendário.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                    React
                  </span>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                    Express
                  </span>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                    MongoDB
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  )
}