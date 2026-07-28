import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { UnauthorizedError } from "./session";

export function jsonError(message: string, status = 400, extra?: object) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

export function handleApiError(err: unknown) {
  if (err instanceof UnauthorizedError) {
    return jsonError("Não autenticado", 401);
  }
  if (err instanceof ZodError) {
    return jsonError("Dados inválidos", 400, { issues: err.issues });
  }
  if (err instanceof Error && (err.message.includes("DATABASE_URL") || err.message.includes("PrismaClientInitializationError"))) {
    return jsonError("Banco de dados não configurado no servidor (DATABASE_URL ausente)", 500);
  }
  console.error("API error:", err);
  return jsonError("Erro interno", 500);
}

export function sameOriginOrFail(headers: Headers): void {
  const origin = headers.get("origin");
  const host = headers.get("host");
  if (!origin) return;
  try {
    const url = new URL(origin);
    if (url.host !== host) {
      if (process.env.NODE_ENV !== "production") return;
      throw new Error("Origin mismatch");
    }
  } catch {
    if (process.env.NODE_ENV !== "production") return;
    throw new Error("Invalid origin");
  }
}
