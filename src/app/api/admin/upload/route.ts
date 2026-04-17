import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/src/lib/session";
import { handleApiError, jsonError, sameOriginOrFail } from "@/src/lib/api-helpers";
import { uploadProjectImage } from "@/src/lib/blob";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    sameOriginOrFail(req.headers);
    await requireAdminApi();

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return jsonError("Nenhum arquivo enviado", 400);
    }

    const uploaded = await uploadProjectImage(file);
    return NextResponse.json(uploaded, { status: 201 });
  } catch (err) {
    console.error("Upload route error:", err);
    if (err instanceof Error && err.message.toLowerCase().includes("inválido")) {
      return jsonError(err.message, 400);
    }
    if (err instanceof Error && err.message.includes("5 MB")) {
      return jsonError(err.message, 413);
    }
    if (err instanceof Error && err.message.includes("BLOB_READ_WRITE_TOKEN")) {
      return jsonError(err.message, 500);
    }
    return handleApiError(err);
  }
}
