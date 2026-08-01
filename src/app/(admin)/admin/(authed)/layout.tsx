import { requireAdmin } from "@/src/lib/session";
import { AdminShell } from "@/src/components/admin/admin-shell";

export default async function AuthedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  return <AdminShell email={session.email ?? ""}>{children}</AdminShell>;
}
