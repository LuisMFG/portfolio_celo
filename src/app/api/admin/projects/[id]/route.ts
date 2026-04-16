import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/src/lib/prisma";
import { requireAdminApi } from "@/src/lib/session";
import { handleApiError, jsonError, sameOriginOrFail } from "@/src/lib/api-helpers";
import { projectSchema } from "@/src/lib/validators";
import { deleteProjectImage } from "@/src/lib/blob";
import { CACHE_TAGS } from "@/src/lib/cache-tags";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminApi();
    const { id } = await params;
    const item = await prisma.project.findUnique({ where: { id } });
    if (!item) return jsonError("Projeto não encontrado", 404);
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
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError("Dados inválidos", 400, { issues: parsed.error.issues });
    }

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) return jsonError("Projeto não encontrado", 404);

    try {
      const updated = await prisma.project.update({
        where: { id },
        data: parsed.data,
      });

      if (
        existing.imageBlobKey &&
        existing.imageBlobKey !== parsed.data.imageBlobKey
      ) {
        await deleteProjectImage(existing.imageBlobKey);
      }

      revalidateTag(CACHE_TAGS.projects);
      return NextResponse.json(updated);
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    sameOriginOrFail(req.headers);
    await requireAdminApi();
    const { id } = await params;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) return jsonError("Projeto não encontrado", 404);

    await prisma.project.delete({ where: { id } });
    if (existing.imageBlobKey) {
      await deleteProjectImage(existing.imageBlobKey);
    }
    revalidateTag(CACHE_TAGS.projects);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
