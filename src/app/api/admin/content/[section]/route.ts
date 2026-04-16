import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/src/lib/prisma";
import { requireAdminApi } from "@/src/lib/session";
import { handleApiError, jsonError, sameOriginOrFail } from "@/src/lib/api-helpers";
import {
  heroContentSchema,
  aboutContentSchema,
  SECTION_FIELDS,
  type SectionName,
} from "@/src/lib/validators";
import { CACHE_TAGS } from "@/src/lib/cache-tags";

const LOCALES = ["pt-BR", "en"] as const;
type Locale = (typeof LOCALES)[number];

const SCHEMAS = {
  hero: heroContentSchema,
  about: aboutContentSchema,
} as const;

function isSection(s: string): s is SectionName {
  return s === "hero" || s === "about";
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ section: string }> },
) {
  try {
    await requireAdminApi();
    const { section } = await params;
    if (!isSection(section)) return jsonError("Seção inválida", 404);

    const rows = await prisma.siteContent.findMany({
      where: { section },
    });

    const result: Record<Locale, Record<string, string>> = {
      "pt-BR": {},
      en: {},
    };
    for (const f of SECTION_FIELDS[section]) {
      result["pt-BR"][f] = "";
      result.en[f] = "";
    }
    for (const r of rows) {
      if (r.locale === "pt-BR" || r.locale === "en") {
        result[r.locale][r.field] = r.value;
      }
    }
    return NextResponse.json(result);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ section: string }> },
) {
  try {
    sameOriginOrFail(req.headers);
    await requireAdminApi();
    const { section } = await params;
    if (!isSection(section)) return jsonError("Seção inválida", 404);

    const body = await req.json().catch(() => ({}));
    const parsed = SCHEMAS[section].safeParse(body);
    if (!parsed.success) {
      return jsonError("Dados inválidos", 400, { issues: parsed.error.issues });
    }

    const data = parsed.data as Record<Locale, Record<string, string>>;

    await prisma.$transaction(
      LOCALES.flatMap((locale) =>
        SECTION_FIELDS[section].map((field) =>
          prisma.siteContent.upsert({
            where: { section_field_locale: { section, field, locale } },
            update: { value: data[locale][field] },
            create: { section, field, locale, value: data[locale][field] },
          }),
        ),
      ),
    );

    revalidateTag(CACHE_TAGS.siteContent);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
