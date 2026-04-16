import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";
import { CACHE_TAGS } from "./cache-tags";

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
  description: string;
};

function isPt(locale: Locale): boolean {
  return locale === "pt-BR";
}

export const fetchExperiences = unstable_cache(
  async (locale: Locale): Promise<ExperienceView[]> => {
    try {
      const rows = await prisma.experience.findMany({
        where: { isPublished: true },
        orderBy: [{ type: "asc" }, { order: "asc" }, { createdAt: "asc" }],
      });
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
      return [];
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
      const pt = isPt(locale);
      return rows.map((r) => ({
        id: r.id,
        slug: r.slug,
        image: r.image,
        technologies: r.technologies,
        githubUrl: r.githubUrl,
        liveUrl: r.liveUrl,
        title: pt ? r.titlePt : r.titleEn,
        description: pt ? r.descriptionPt : r.descriptionEn,
      }));
    } catch (err) {
      console.error("fetchProjects failed:", err);
      return [];
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
