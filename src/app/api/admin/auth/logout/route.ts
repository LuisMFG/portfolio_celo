import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/src/lib/session";
import { handleApiError, sameOriginOrFail } from "@/src/lib/api-helpers";

export async function POST(req: NextRequest) {
  try {
    sameOriginOrFail(req.headers);
    const session = await getSession();
    session.destroy();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
