import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/src/lib/prisma";
import { requireAdminApi } from "@/src/lib/session";
import { handleApiError, jsonError, sameOriginOrFail } from "@/src/lib/api-helpers";
import { experienceSchema } from "@/src/lib/validators";
import { CACHE_TAGS } from "@/src/lib/cache-tags";

export async function GET() {
  try {
    await requireAdminApi();
    const items = await prisma.experience.findMany({
      orderBy: [{ type: "asc" }, { order: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json(items);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    sameOriginOrFail(req.headers);
    await requireAdminApi();

    const body = await req.json().catch(() => ({}));
    const parsed = experienceSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError("Dados inválidos", 400, { issues: parsed.error.issues });
    }

    const created = await prisma.experience.create({ data: parsed.data });
    revalidateTag(CACHE_TAGS.experiences);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
