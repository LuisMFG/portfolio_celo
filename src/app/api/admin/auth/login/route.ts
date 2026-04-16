import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials } from "@/src/lib/auth";
import { getSession } from "@/src/lib/session";
import { rateLimit, clientIp } from "@/src/lib/rate-limit";
import { handleApiError, jsonError, sameOriginOrFail } from "@/src/lib/api-helpers";
import { loginSchema } from "@/src/lib/validators";

export async function POST(req: NextRequest) {
  try {
    sameOriginOrFail(req.headers);

    const ip = clientIp(req.headers);
    const limit = rateLimit(`login:${ip}`, 5, 15 * 60);
    if (!limit.allowed) {
      return jsonError(
        `Muitas tentativas. Tente novamente em ${limit.retryAfterSeconds}s.`,
        429,
      );
    }

    const body = await req.json().catch(() => ({}));
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError("Credenciais inválidas", 400);
    }

    const user = await verifyCredentials(parsed.data.email, parsed.data.password);
    if (!user) {
      return jsonError("Credenciais inválidas", 401);
    }

    const session = await getSession();
    session.userId = user.id;
    session.email = user.email;
    await session.save();

    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
