import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const prisma = new PrismaClient();

type Locale = "pt-BR" | "en";

type ExperienceTranslations = Record<
  string,
  { title: string; company: string; period: string; description: string }
>;

type ProjectTranslations = Record<string, { title: string; description: string }>;

type Messages = {
  HeroSection: { greeting: string; subtitle: string; description: string };
  AboutSection: { paragraph1: string; paragraph2: string };
  ExperienceSection: { items: ExperienceTranslations };
  ProjectsSection: { items: ProjectTranslations };
};

type ProjectSeed = {
  id: string;
  image: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
};

const PROJECT_SEED: ProjectSeed[] = [
  { id: "coneci-ro", image: "/images/projeto_coneci_ro.jpeg", technologies: ["React", "TypeScript", "Tailwind", "Vite"] },
  { id: "estudante-auditor", image: "/images/projeto_estudanteauditor.png", technologies: ["C#", "ASP.NET Core MVC", "Razor (HTML)", "CSS", "JavaScript"], liveUrl: "https://estudanteauditor.cge.ro.gov.br/" },
  { id: "wiki-cge", image: "/images/projeto_wikicge.png", technologies: ["HTML", "CSS", "JS"], liveUrl: "https://wiki.cge.ro.gov.br" },
  { id: "gerenciador-de-horarios", image: "/images/projeto-gerenciadordehorarios.png", technologies: ["PHP", "CodeIgniter", "HTML", "CSS", "Bootstrap"], liveUrl: "https://ifrocalama.com" },
  { id: "chaewon-yugioh", image: "/images/projeto_chaewon_yugioh.png", technologies: ["Next.js", "Three.js"], githubUrl: "https://github.com/LuisMFG/petshop-cat-dog" },
  { id: "catedog", image: "/images/projeto_catedog.png", technologies: ["HTML", "CSS", "JavaScript", "Node.js", "Express", "SQLite"], githubUrl: "https://github.com/LuisMFG/petshop-cat-dog" },
  { id: "pokedex", image: "/images/projeto_pokedex.png", technologies: ["HTML", "CSS", "Javascript"], githubUrl: "https://github.com/LuisMFG/pokedex-project" },
  { id: "receitas-do-mestre", image: "/images/projeto_receitasdomestre.png", technologies: ["HTML", "CSS", "Bootstrap"], githubUrl: "https://github.com/LuisMFG/pagina-receitas" },
  { id: "spacetime-sga", image: "/images/projeto_capsuladotempo.png", technologies: ["HTML", "CSS"], githubUrl: "https://github.com/LuisMFG/spacetimeToSGA" },
];

const EXPERIENCE_TYPE_BY_ID: Record<string, "professional" | "academic"> = {
  "prof-1": "professional",
  "prof-2": "professional",
  "prof-3": "professional",
  "prof-4": "professional",
  "acad-1": "academic",
  "acad-2": "academic",
};

const EXPERIENCE_ORDER = ["prof-1", "prof-2", "prof-3", "prof-4", "acad-1", "acad-2"];

async function loadMessages(locale: Locale): Promise<Messages> {
  const file = path.join(process.cwd(), "messages", `${locale}.json`);
  const raw = await readFile(file, "utf-8");
  return JSON.parse(raw) as Messages;
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn("⚠️  ADMIN_EMAIL/ADMIN_PASSWORD não definidos — pulando criação de admin.");
    return;
  }

  if (password.length < 10) {
    throw new Error("ADMIN_PASSWORD deve ter pelo menos 10 caracteres.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  console.log(`✓ Admin criado/atualizado: ${email}`);
}

async function seedSiteContent(pt: Messages, en: Messages) {
  const entries: { section: string; field: string; locale: Locale; value: string }[] = [
    { section: "hero", field: "greeting", locale: "pt-BR", value: pt.HeroSection.greeting },
    { section: "hero", field: "subtitle", locale: "pt-BR", value: pt.HeroSection.subtitle },
    { section: "hero", field: "description", locale: "pt-BR", value: pt.HeroSection.description },
    { section: "hero", field: "greeting", locale: "en", value: en.HeroSection.greeting },
    { section: "hero", field: "subtitle", locale: "en", value: en.HeroSection.subtitle },
    { section: "hero", field: "description", locale: "en", value: en.HeroSection.description },
    { section: "about", field: "paragraph1", locale: "pt-BR", value: pt.AboutSection.paragraph1 },
    { section: "about", field: "paragraph2", locale: "pt-BR", value: pt.AboutSection.paragraph2 },
    { section: "about", field: "paragraph1", locale: "en", value: en.AboutSection.paragraph1 },
    { section: "about", field: "paragraph2", locale: "en", value: en.AboutSection.paragraph2 },
  ];

  for (const e of entries) {
    await prisma.siteContent.upsert({
      where: {
        section_field_locale: {
          section: e.section,
          field: e.field,
          locale: e.locale,
        },
      },
      update: { value: e.value },
      create: e,
    });
  }
  console.log(`✓ ${entries.length} entradas de SiteContent`);
}

async function seedExperiences(pt: Messages, en: Messages) {
  const existing = await prisma.experience.count();
  if (existing > 0) {
    console.log(`↻ ${existing} experiências já existentes — não sobrescrevendo.`);
    return;
  }

  for (let i = 0; i < EXPERIENCE_ORDER.length; i++) {
    const id = EXPERIENCE_ORDER[i];
    const ptItem = pt.ExperienceSection.items[id];
    const enItem = en.ExperienceSection.items[id];
    if (!ptItem || !enItem) continue;

    await prisma.experience.create({
      data: {
        type: EXPERIENCE_TYPE_BY_ID[id],
        order: i,
        titlePt: ptItem.title,
        titleEn: enItem.title,
        companyPt: ptItem.company,
        companyEn: enItem.company,
        periodPt: ptItem.period,
        periodEn: enItem.period,
        descriptionPt: ptItem.description,
        descriptionEn: enItem.description,
      },
    });
  }
  console.log(`✓ ${EXPERIENCE_ORDER.length} experiências`);
}

async function seedProjects(pt: Messages, en: Messages) {
  const existing = await prisma.project.count();
  if (existing > 0) {
    console.log(`↻ ${existing} projetos já existentes — não sobrescrevendo.`);
    return;
  }

  for (let i = 0; i < PROJECT_SEED.length; i++) {
    const p = PROJECT_SEED[i];
    const ptItem = pt.ProjectsSection.items[p.id];
    const enItem = en.ProjectsSection.items[p.id];
    if (!ptItem || !enItem) continue;

    await prisma.project.create({
      data: {
        slug: p.id,
        image: p.image,
        technologies: p.technologies,
        githubUrl: p.githubUrl ?? null,
        liveUrl: p.liveUrl ?? null,
        order: i,
        titlePt: ptItem.title,
        titleEn: enItem.title,
        descriptionPt: ptItem.description,
        descriptionEn: enItem.description,
      },
    });
  }
  console.log(`✓ ${PROJECT_SEED.length} projetos`);
}

async function main() {
  const [pt, en] = await Promise.all([loadMessages("pt-BR"), loadMessages("en")]);
  await seedAdmin();
  await seedSiteContent(pt, en);
  await seedExperiences(pt, en);
  await seedProjects(pt, en);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
