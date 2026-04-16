import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const BCRYPT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export async function verifyCredentials(
  email: string,
  password: string,
): Promise<{ id: string; email: string } | null> {
  const normalized = email.trim().toLowerCase();
  const user = await prisma.adminUser.findUnique({
    where: { email: normalized },
  });

  if (!user) {
    await bcrypt.compare(password, "$2a$12$invalidsaltinvalidsaltinvali.uM4N6dB6iRfX7T8YqU7rY9xT1nB6m");
    return null;
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;

  return { id: user.id, email: user.email };
}
