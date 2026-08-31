import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";
import { CACHE_TAGS } from "./cache-tags";
import ptMessages from "../../messages/pt-BR.json";
import enMessages from "../../messages/en.json";
import { type ProjectStatus } from "./validators";
import { deriveStatusFromTitle, toProjectStatus } from "./project-status";

export type Locale = "pt-BR" | "en";

export type ExperienceView = {
  id: string;
  type: "professional" | "academic";
  title: string;
  company: string;
  period: string;
  description: string;
};

export type ProjectView = {
  id: string;
  slug: string;
  image: string;
  technologies: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  title: string;
  status: ProjectStatus;
  description: string;
};

function isPt(locale: Locale): boolean {
  return locale === "pt-BR";
}

const EXPERIENCE_TYPE_BY_ID: Record<string, "professional" | "academic"> = {
  "prof-1": "professional",
  "prof-2": "professional",
  "prof-3": "professional",
  "prof-4": "professional",
  "acad-1": "academic",
  "acad-2": "academic",
};

const EXPERIENCE_ORDER = ["prof-1", "prof-2", "prof-3", "prof-4", "acad-1", "acad-2"];

const DEFAULT_PROJECT_SEED = [
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

function getDefaultExperiences(locale: Locale): ExperienceView[] {
  const messages = locale === "pt-BR" ? ptMessages : enMessages;
  const items = (messages.ExperienceSection as Record<string, unknown>).items as Record<
    string,
    { title: string; company: string; period: string; description: string }
  >;

  if (!items) return [];

  return EXPERIENCE_ORDER.map((id) => {
    const item = items[id];
    return {
      id,
      type: EXPERIENCE_TYPE_BY_ID[id] ?? "professional",
      title: item?.title ?? "",
      company: item?.company ?? "",
      period: item?.period ?? "",
      description: item?.description ?? "",
    };
  }).filter((e) => e.title !== "");
}

function getDefaultProjects(locale: Locale): ProjectView[] {
  const messages = locale === "pt-BR" ? ptMessages : enMessages;
  const items = (messages.ProjectsSection as Record<string, unknown>).items as Record<
    string,
    { title: string; description: string }
  >;

  if (!items) return [];

  // O status deriva sempre do título PT, mesmo quando o locale é en — o
  // marcador "(Em Construção)" só existe do lado português.
  const ptItems = (ptMessages.ProjectsSection as Record<string, unknown>)
    .items as Record<string, { title: string; description: string }>;

  return DEFAULT_PROJECT_SEED.map((p) => {
    const item = items[p.id];
    const title = item?.title ?? p.id;
    return {
      id: p.id,
      slug: p.id,
      image: p.image,
      technologies: p.technologies,
      githubUrl: p.githubUrl ?? null,
      liveUrl: p.liveUrl ?? null,
      title,
      // Sem banco, o status vem do próprio título — mesma regra do seed.
      status: deriveStatusFromTitle(ptItems[p.id]?.title ?? ""),
      description: item?.description ?? "",
    };
  });
}

export const fetchExperiences = unstable_cache(
  async (locale: Locale): Promise<ExperienceView[]> => {
    try {
      const rows = await prisma.experience.findMany({
        where: { isPublished: true },
        orderBy: [{ type: "asc" }, { order: "asc" }, { createdAt: "asc" }],
      });
      if (rows.length === 0) {
        return getDefaultExperiences(locale);
      }
      const pt = isPt(locale);
      return rows.map((r) => ({
        id: r.id,
        type: r.type as "professional" | "academic",
        title: pt ? r.titlePt : r.titleEn,
        company: pt ? r.companyPt : r.companyEn,
        period: pt ? r.periodPt : r.periodEn,
        description: pt ? r.descriptionPt : r.descriptionEn,
      }));
    } catch (err) {
      console.error("fetchExperiences failed:", err);
      return getDefaultExperiences(locale);
    }
  },
  ["fetchExperiences"],
  { tags: [CACHE_TAGS.experiences], revalidate: 3600 },
);

export const fetchProjects = unstable_cache(
  async (locale: Locale): Promise<ProjectView[]> => {
    try {
      const rows = await prisma.project.findMany({
        where: { isPublished: true },
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      });
      if (rows.length === 0) {
        return getDefaultProjects(locale);
      }
      const pt = isPt(locale);
      return rows.map((r) => ({
        id: r.id,
        slug: r.slug,
        image: r.image,
        technologies: r.technologies,
        githubUrl: r.githubUrl,
        liveUrl: r.liveUrl,
        title: pt ? r.titlePt : r.titleEn,
        status: toProjectStatus(r.status),
        description: pt ? r.descriptionPt : r.descriptionEn,
      }));
    } catch (err) {
      console.error("fetchProjects failed:", err);
      return getDefaultProjects(locale);
    }
  },
  ["fetchProjects"],
  { tags: [CACHE_TAGS.projects], revalidate: 3600 },
);

export const fetchSiteContent = unstable_cache(
  async (locale: Locale): Promise<Record<string, Record<string, string>>> => {
    try {
      const rows = await prisma.siteContent.findMany({ where: { locale } });
      const result: Record<string, Record<string, string>> = {};
      for (const r of rows) {
        result[r.section] ??= {};
        result[r.section][r.field] = r.value;
      }
      return result;
    } catch (err) {
      console.error("fetchSiteContent failed:", err);
      return {};
    }
  },
  ["fetchSiteContent"],
  { tags: [CACHE_TAGS.siteContent], revalidate: 3600 },
);
