"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/sidebar";
import { ParticlesBackground } from "@/components/particles-background";
import Image from "next/image";
import { technologies } from "@/components/technologies";
import { Icons } from "@/components/icons";
import { LoadingScreen } from "@/components/loadingscreen";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

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
              Entusiasta da tecnologia, apaixonado por programação e
              infraestrutura de TI. Atualmente, sou estagiário em
              Desenvolvimento Full Stack na CGE/RO, atuando no Núcleo de
              Inovação e Prevenção à Corrupção.
            </p>
            <p className="text-lg text-muted-foreground">
              Estou sempre em busca de aprimorar minhas habilidades e contribuir
              com soluções inovadoras, unindo conhecimento acadêmico à
              experiência prática para enfrentar desafios e criar impacto
              positivo.
            </p>
          </motion.div>
        </section>

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
            <h2 className="text-3xl font-bold mb-12 text-center">
              Tecnologias
            </h2>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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
                  <div className="border-l-2 border-primary pl-6">
                    <h4 className="text-xl font-semibold">
                      Estagiário de Desenvolvimento Full Stack
                    </h4>
                    <p className="text-muted-foreground mb-2">
                      CGE/RO - Controladoria Geral do Estado de Rondônia • abr
                      de 2025 - Presente
                    </p>
                    <p className="text-muted-foreground">
                      Desenvolvimento de aplicações web escaláveis, liderança
                      técnica de equipe e implementação de arquiteturas
                      modernas.
                    </p>
                  </div>

                  <div className="border-l-2 border-primary pl-6">
                    <h4 className="text-xl font-semibold">Estagiário de TI</h4>
                    <p className="text-muted-foreground mb-2">
                      CGE/RO (Controladoria Geral do Estado de Rondônia) • out
                      de 2024 - abr de 2025
                    </p>
                    <p className="text-muted-foreground">
                      Suporte e infraestrutura de TI
                    </p>
                  </div>
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
                  <div className="border-l-2 border-primary pl-6">
                    <h4 className="text-xl font-semibold">
                      CST em Análise e Desenvolvimento de Sistemas
                    </h4>
                    <p className="text-muted-foreground mb-2">
                      IFRO (Instituto Federal de Educação, Ciência e Tecnologia
                      de Rondônia) • fev de 2023 - Presente
                    </p>
                    <p className="text-muted-foreground">
                      Cursando o 5° período de 6 períodos.
                    </p>
                  </div>

                  <div className="border-l-2 border-primary pl-6">
                    <h4 className="text-xl font-semibold">
                      Tecnico em Informática
                    </h4>
                    <p className="text-muted-foreground mb-2">
                      IFAM (Instituto Federal de Educação, Ciência e Tecnologia
                      do Amazonas) • jan de 2018 - dez de 2020
                    </p>
                    <p className="text-muted-foreground">
                      Participação em projetos de pesquisa e desenvolvimento de
                      sistemas web e mobile utilizando tecnologias modernas.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        <section
          id="projects"
          className="min-h-screen snap-start flex items-center p-8"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto w-full"
          >
            <h2 className="text-3xl font-bold mb-12 text-center">Projetos</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Projeto 1 */}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-card p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-white/10 hover:border-primary"
              >
                <div>
                  <div className="overflow-hidden rounded-lg mb-4">
                    <img
                      src="\images\projeto_coneci_ro.jpeg"
                      alt="Catedog"
                      className="w-full aspect-video object-contain rounded-lg transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    CONECI - RO (Em Construção)
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Desenvolvendo a landing page oficial do CONECI-RO, o
                    Conselho Estadual de Controle Interno, com sistema de
                    votação para eleger a nova presidência do evento.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      React
                    </span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      TypeScript
                    </span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      Tailwind
                    </span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      Vite
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-card p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-white/10 hover:border-primary"
              >
                <div>
                  <div className="overflow-hidden rounded-lg mb-4">
                    <img
                      src="\images\projeto_estudanteauditor.png"
                      alt="Catedog"
                      className="w-full aspect-video object-contain rounded-lg transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Estudante Auditor (Em Construção)
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Desenvolvendo a landing page oficial do Projeto Estudante
                    Auditor, uma iniciativa da Controladoria-Geral do Estado de
                    Rondônia (CGE/RO) em parceria com a SEDUC/RO.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      C#
                    </span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      ASP.NET Core MVC
                    </span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      Razor (HTML)
                    </span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      CSS
                    </span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      JavaScript
                    </span>
                  </div>
                </div>
                <Button asChild variant="outline" className="mt-auto">
                  <a
                    href="https://estudanteauditor.cge.ro.gov.br/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visualizar página
                  </a>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-card p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-white/10 hover:border-primary"
              >
                <div>
                  <div className="overflow-hidden rounded-lg mb-4">
                    <img
                      src="\images\projeto_wikicge.png"
                      alt="wikicge"
                      className="w-full aspect-video object-contain rounded-lg transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Wiki.CGE (Em construção)
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Participo no desenvolvimento da Wiki.CGE, uma plataforma
                    informativa voltada à transparência, documentação interna e
                    disseminação de conhecimento institucional da Controladoria
                    Geral do Estado de Rondônia.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      HTML
                    </span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      CSS
                    </span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      JS
                    </span>
                  </div>
                </div>
                <Button asChild variant="outline" className="mt-auto">
                  <a
                    href="https://wiki.cge.ro.gov.br"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visualizar página
                  </a>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-card p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-white/10 hover:border-primary"
              >
                <div>
                  <div className="overflow-hidden rounded-lg mb-4">
                    <img
                      src="/images/projeto_chaewon_yugioh.png"
                      alt="Catedog"
                      className="w-full aspect-video object-contain rounded-lg transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    3D Card Chaewon Yugioh
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Desenvolvi uma carta 3D animada da Chaewon em estilo
                    Yu-Gi-Oh!
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      Next.js
                    </span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      Three.js
                    </span>
                  </div>
                </div>
                <Button asChild variant="outline" className="mt-auto">
                  <a
                    href="https://github.com/LuisMFG/petshop-cat-dog"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    Ver no GitHub
                  </a>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-card p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-white/10 hover:border-primary"
              >
                <div>
                  <div className="overflow-hidden rounded-lg mb-4">
                    <img
                      src="/images/projeto_catedog.png"
                      alt="Catedog"
                      className="w-full aspect-video object-contain rounded-lg transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Cat&Dog</h3>
                  <p className="text-muted-foreground mb-4">
                    Sistema web para pet shop com cadastro de usuários e
                    animais, solicitação de serviços (banho, tosa), e-commerce
                    com entrega gratuita e painel administrativo completo.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      HTML
                    </span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      CSS
                    </span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      JavaScript
                    </span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      Node.js
                    </span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      Express
                    </span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      SQLite
                    </span>
                  </div>
                </div>
                <Button asChild variant="outline" className="mt-auto">
                  <a
                    href="https://github.com/LuisMFG/petshop-cat-dog"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    Ver no GitHub
                  </a>
                </Button>
              </motion.div>

              {/* Projeto 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-card p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-white/10 hover:border-primary"
              >
                <div>
                  <div className="overflow-hidden rounded-lg mb-4">
                    <img
                      src="\images\projeto_pokedex.png"
                      alt="Task Management App"
                      className="w-full aspect-video object-contain rounded-lg transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Pokedex</h3>
                  <p className="text-muted-foreground mb-4">
                    Desenvolvido com o objetivo de praticar o consumo de APIs. É
                    uma Pokédex interativa que utiliza a PokéAPI para buscar
                    informações em tempo real sobre diferentes Pokémons, como
                    nome, imagem, tipo e número.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      HTML
                    </span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      CSS
                    </span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      Javascript
                    </span>
                  </div>
                </div>
                <Button asChild variant="outline" className="mt-auto">
                  <a
                    href="https://github.com/LuisMFG/pokedex-project"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    Ver no GitHub
                  </a>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-card p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-white/10 hover:border-primary"
              >
                <div>
                  <div className="overflow-hidden rounded-lg mb-4">
                    <img
                      src="\images\projeto_receitasdomestre.png"
                      alt="Task Management App"
                      className="w-full aspect-video object-contain rounded-lg transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Receitas do Mestre
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    É um blog de receitas, que foi realizado como parte da
                    disciplina Fundamentos de Programação Web, com o intuito de
                    demonstrar conhecimentos em HTML.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      HTML
                    </span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      CSS
                    </span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      Bootstrap
                    </span>
                  </div>
                </div>
                <Button asChild variant="outline" className="mt-auto">
                  <a
                    href="https://github.com/LuisMFG/pagina-receitas"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    Ver no GitHub
                  </a>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-card p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-white/10 hover:border-primary"
              >
                <div>
                  <div className="overflow-hidden rounded-lg mb-4">
                    <img
                      src="/images/projeto_capsuladotempo.png"
                      alt="Task Management App"
                      className="w-full aspect-video object-contain rounded-lg transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Spacetime - Shai Gilgeous Alexander
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Uma cápsula do tempo interativa para exibir memórias ao
                    longo de uma linha do tempo, criando uma experiência visual
                    e responsiva.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      HTML
                    </span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      CSS
                    </span>
                  </div>
                </div>
                <Button asChild variant="outline" className="mt-auto">
                  <a
                    href="https://github.com/LuisMFG/spacetimeToSGA"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    Ver no GitHub
                  </a>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
