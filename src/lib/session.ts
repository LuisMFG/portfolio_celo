import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getIronSession, type SessionOptions } from "iron-session";

export type AdminSession = {
  userId?: string;
  email?: string;
};

const SEVEN_DAYS = 60 * 60 * 24 * 7;

function getSessionPassword(): string {
  const password = process.env.SESSION_SECRET;
  if (!password || password.length < 32) {
    throw new Error(
      "SESSION_SECRET must be set and at least 32 characters long",
    );
  }
  return password;
}

function buildOptions(): SessionOptions {
  return {
    cookieName: "portfolio_admin_session",
    password: getSessionPassword(),
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SEVEN_DAYS,
    },
    ttl: SEVEN_DAYS,
  };
}

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<AdminSession>(cookieStore, buildOptions());
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session.userId) {
    redirect("/admin/login");
  }
  return session;
}

export async function requireAdminApi(): Promise<AdminSession> {
  const session = await getSession();
  if (!session.userId) {
    throw new UnauthorizedError();
  }
  return session;
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}
