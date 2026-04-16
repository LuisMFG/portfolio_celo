import { redirect } from "next/navigation";
import { getSession } from "@/src/lib/session";
import { LoginForm } from "@/src/components/admin/login-form";

export default async function LoginPage() {
  const session = await getSession();
  if (session.userId) redirect("/admin/dashboard");

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Admin</h1>
          <p className="text-sm text-muted-foreground">
            Acesso restrito ao painel de gerenciamento.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
