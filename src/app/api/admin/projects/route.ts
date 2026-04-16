import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/src/lib/prisma";
import { requireAdminApi } from "@/src/lib/session";
import { handleApiError, jsonError, sameOriginOrFail } from "@/src/lib/api-helpers";
import { projectSchema } from "@/src/lib/validators";
import { CACHE_TAGS } from "@/src/lib/cache-tags";

export async function GET() {
  try {
    await requireAdminApi();
    const items = await prisma.project.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
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
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError("Dados inválidos", 400, { issues: parsed.error.issues });
    }

    try {
      const created = await prisma.project.create({ data: parsed.data });
      revalidateTag(CACHE_TAGS.projects);
      return NextResponse.json(created, { status: 201 });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        return jsonError("Slug já em uso", 409);
      }
      throw err;
    }
  } catch (err) {
    return handleApiError(err);
  }
}
