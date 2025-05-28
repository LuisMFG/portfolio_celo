export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export const projects: Project[] = [
  {
    id: "coneci-ro",
    title: "CONECI - RO (Em Construção)",
    description: "Desenvolvendo a landing page oficial do CONECI-RO, o Conselho Estadual de Controle Interno, com sistema de votação para eleger a nova presidência do evento.",
    image: "/images/projeto_coneci_ro.jpeg",
    technologies: ["React", "TypeScript", "Tailwind", "Vite"]
  },
  {
    id: "estudante-auditor",
    title: "Estudante Auditor (Em Construção)",
    description: "Desenvolvendo a landing page oficial do Projeto Estudante Auditor, uma iniciativa da Controladoria-Geral do Estado de Rondônia (CGE/RO) em parceria com a SEDUC/RO.",
    image: "/images/projeto_estudanteauditor.png",
    technologies: ["C#", "ASP.NET Core MVC", "Razor (HTML)", "CSS", "JavaScript"],
    liveUrl: "https://estudanteauditor.cge.ro.gov.br/"
  },
  {
    id: "wiki-cge",
    title: "Wiki.CGE (Em construção)",
    description: "Participo no desenvolvimento da Wiki.CGE, uma plataforma informativa voltada à transparência, documentação interna e disseminação de conhecimento institucional da Controladoria Geral do Estado de Rondônia.",
    image: "/images/projeto_wikicge.png",
    technologies: ["HTML", "CSS", "JS"],
    liveUrl: "https://wiki.cge.ro.gov.br"
  },
  {
    id: "chaewon-yugioh",
    title: "3D Card Chaewon Yugioh",
    description: "Desenvolvi uma carta 3D animada da Chaewon em estilo Yu-Gi-Oh!",
    image: "/images/projeto_chaewon_yugioh.png",
    technologies: ["Next.js", "Three.js"],
    githubUrl: "https://github.com/LuisMFG/petshop-cat-dog"
  },
  {
    id: "catedog",
    title: "Cat&Dog",
    description: "Sistema web para pet shop com cadastro de usuários e animais, solicitação de serviços (banho, tosa), e-commerce com entrega gratuita e painel administrativo completo.",
    image: "/images/projeto_catedog.png",
    technologies: ["HTML", "CSS", "JavaScript", "Node.js", "Express", "SQLite"],
    githubUrl: "https://github.com/LuisMFG/petshop-cat-dog"
  },
  {
    id: "pokedex",
    title: "Pokedex",
    description: "Desenvolvido com o objetivo de praticar o consumo de APIs. É uma Pokédex interativa que utiliza a PokéAPI para buscar informações em tempo real sobre diferentes Pokémons, como nome, imagem, tipo e número.",
    image: "/images/projeto_pokedex.png",
    technologies: ["HTML", "CSS", "Javascript"],
    githubUrl: "https://github.com/LuisMFG/pokedex-project"
  },
  {
    id: "receitas-do-mestre",
    title: "Receitas do Mestre",
    description: "É um blog de receitas, que foi realizado como parte da disciplina Fundamentos de Programação Web, com o intuito de demonstrar conhecimentos em HTML.",
    image: "/images/projeto_receitasdomestre.png",
    technologies: ["HTML", "CSS", "Bootstrap"],
    githubUrl: "https://github.com/LuisMFG/pagina-receitas"
  },
  {
    id: "spacetime-sga",
    title: "Spacetime - Shai Gilgeous Alexander",
    description: "Uma cápsula do tempo interativa para exibir memórias ao longo de uma linha do tempo, criando uma experiência visual e responsiva.",
    image: "/images/projeto_capsuladotempo.png",
    technologies: ["HTML", "CSS"],
    githubUrl: "https://github.com/LuisMFG/spacetimeToSGA"
  }
];