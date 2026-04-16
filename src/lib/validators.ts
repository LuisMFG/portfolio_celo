import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  password: z.string().min(1).max(200),
});

const heroFields = ["greeting", "subtitle", "description"] as const;
const aboutFields = ["paragraph1", "paragraph2"] as const;

export const heroContentSchema = z.object({
  "pt-BR": z.object({
    greeting: z.string().trim().min(1).max(200),
    subtitle: z.string().trim().min(1).max(200),
    description: z.string().trim().min(1).max(500),
  }),
  en: z.object({
    greeting: z.string().trim().min(1).max(200),
    subtitle: z.string().trim().min(1).max(200),
    description: z.string().trim().min(1).max(500),
  }),
});

export const aboutContentSchema = z.object({
  "pt-BR": z.object({
    paragraph1: z.string().trim().min(1).max(2000),
    paragraph2: z.string().trim().min(1).max(2000),
  }),
  en: z.object({
    paragraph1: z.string().trim().min(1).max(2000),
    paragraph2: z.string().trim().min(1).max(2000),
  }),
});

export const SECTION_FIELDS = {
  hero: heroFields,
  about: aboutFields,
} as const;

export type SectionName = keyof typeof SECTION_FIELDS;

export const experienceSchema = z.object({
  type: z.enum(["professional", "academic"]),
  order: z.number().int().min(0).default(0),
  titlePt: z.string().trim().min(1).max(200),
  titleEn: z.string().trim().min(1).max(200),
  companyPt: z.string().trim().min(1).max(200),
  companyEn: z.string().trim().min(1).max(200),
  periodPt: z.string().trim().min(1).max(100),
  periodEn: z.string().trim().min(1).max(100),
  descriptionPt: z.string().trim().min(1).max(2000),
  descriptionEn: z.string().trim().min(1).max(2000),
  isPublished: z.boolean().default(true),
});

const URL_SCHEMA = z
  .string()
  .trim()
  .url()
  .max(500)
  .or(z.literal(""))
  .transform((v) => (v === "" ? null : v))
  .nullable();

export const projectSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífens"),
  image: z.string().trim().url().max(1000),
  imageBlobKey: z.string().max(500).nullable().optional(),
  technologies: z.array(z.string().trim().min(1).max(50)).max(30),
  githubUrl: URL_SCHEMA.optional(),
  liveUrl: URL_SCHEMA.optional(),
  order: z.number().int().min(0).default(0),
  titlePt: z.string().trim().min(1).max(200),
  titleEn: z.string().trim().min(1).max(200),
  descriptionPt: z.string().trim().min(1).max(2000),
  descriptionEn: z.string().trim().min(1).max(2000),
  isPublished: z.boolean().default(true),
});

export type ExperienceInput = z.infer<typeof experienceSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
