import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/src/lib/prisma";
import { requireAdminApi } from "@/src/lib/session";
import { handleApiError, jsonError, sameOriginOrFail } from "@/src/lib/api-helpers";
import { experienceSchema } from "@/src/lib/validators";
import { CACHE_TAGS } from "@/src/lib/cache-tags";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminApi();
    const { id } = await params;
    const item = await prisma.experience.findUnique({ where: { id } });
    if (!item) return jsonError("Experiência não encontrada", 404);
    return NextResponse.json(item);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    sameOriginOrFail(req.headers);
    await requireAdminApi();
    const { id } = await params;

    const body = await req.json().catch(() => ({}));
    const parsed = experienceSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError("Dados inválidos", 400, { issues: parsed.error.issues });
    }

    const updated = await prisma.experience.update({
      where: { id },
      data: parsed.data,
    });
    revalidateTag(CACHE_TAGS.experiences);
    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return jsonError("Experiência não encontrada", 404);
    }
    return handleApiError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    sameOriginOrFail(req.headers);
    await requireAdminApi();
    const { id } = await params;
    await prisma.experience.delete({ where: { id } });
    revalidateTag(CACHE_TAGS.experiences);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return jsonError("Experiência não encontrada", 404);
    }
    return handleApiError(err);
  }
}
