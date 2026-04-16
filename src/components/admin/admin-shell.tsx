"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  FolderKanban,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/hero", label: "Hero", Icon: User },
  { href: "/admin/about", label: "Sobre Mim", Icon: FileText },
  { href: "/admin/experiences", label: "Experiências", Icon: Briefcase },
  { href: "/admin/projects", label: "Projetos", Icon: FolderKanban },
];

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen">
      <button
        type="button"
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-md bg-card border"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card border-r flex flex-col transition-transform",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="p-4 border-b">
          <p className="text-sm font-semibold">Painel Admin</p>
          <p className="text-xs text-muted-foreground truncate" title={email}>
            {email}
          </p>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {NAV.map(({ href, label, Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-2 border-t space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-muted"
          >
            <ExternalLink className="h-4 w-4" />
            Ver site
          </Link>
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-muted text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-10 max-w-5xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
