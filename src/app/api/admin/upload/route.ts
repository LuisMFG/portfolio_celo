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
    if (err instanceof Error) {
      const msg = err.message;
      if (msg.toLowerCase().includes("inválido")) return jsonError(msg, 400);
      if (msg.includes("5 MB")) return jsonError(msg, 413);
      if (msg.includes("BLOB_READ_WRITE_TOKEN")) return jsonError(msg, 500);
      // Surface Vercel Blob errors to the client for debugging
      return jsonError(msg, 500);
    }
    return handleApiError(err);
  }
}
