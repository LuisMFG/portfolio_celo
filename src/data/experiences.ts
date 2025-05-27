// @/data/experiences.ts

export interface Experience {
  id: string;
  type: "professional" | "academic";
  title: string;
  company: string;
  period: string;
  description: string;
}

export const experiences: Experience[] = [
  // Experiências Profissionais
  {
    id: "prof-1",
    type: "professional",
    title: "Estagiário de Desenvolvimento Full Stack",
    company: "CGE/RO - Controladoria Geral do Estado de Rondônia",
    period: "abr de 2025 - Presente",
    description: "Desenvolvimento de aplicações web escaláveis, liderança técnica de equipe e implementação de arquiteturas modernas."
  },
  {
    id: "prof-2", 
    type: "professional",
    title: "Estagiário de TI",
    company: "CGE/RO (Controladoria Geral do Estado de Rondônia)",
    period: "out de 2024 - abr de 2025",
    description: "Suporte e infraestrutura de TI"
  },

  // Experiências Acadêmicas
  {
    id: "acad-1",
    type: "academic",
    title: "CST em Análise e Desenvolvimento de Sistemas",
    company: "IFRO (Instituto Federal de Educação, Ciência e Tecnologia de Rondônia)",
    period: "fev de 2023 - Presente",
    description: "Cursando o 5° período de 6 períodos."
  },
  {
    id: "acad-2",
    type: "academic",
    title: "Técnico em Informática",
    company: "IFAM (Instituto Federal de Educação, Ciência e Tecnologia do Amazonas)",
    period: "jan de 2018 - dez de 2020", 
    description: "Participação em projetos de pesquisa e desenvolvimento de sistemas web e mobile utilizando tecnologias modernas."
  }
];