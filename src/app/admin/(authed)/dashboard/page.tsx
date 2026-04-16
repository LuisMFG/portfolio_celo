import Link from "next/link";
import {
  Briefcase,
  FileText,
  FolderKanban,
  User,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/src/lib/prisma";

const CARDS = [
  { href: "/admin/hero", title: "Hero", description: "Saudação, subtítulo e descrição da home.", Icon: User },
  { href: "/admin/about", title: "Sobre Mim", description: "Parágrafos da seção 'Sobre Mim'.", Icon: FileText },
  { href: "/admin/experiences", title: "Experiências", description: "Profissionais e acadêmicas.", Icon: Briefcase },
  { href: "/admin/projects", title: "Projetos", description: "Portfólio com upload de imagem.", Icon: FolderKanban },
];

export default async function DashboardPage() {
  const [exp, proj] = await Promise.all([
    prisma.experience.count(),
    prisma.project.count(),
  ]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          {exp} experiências · {proj} projetos cadastrados.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {CARDS.map(({ href, title, description, Icon }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-lg border bg-card p-5 hover:border-primary transition-colors"
          >
            <div className="flex items-start justify-between">
              <Icon className="h-6 w-6 text-primary" />
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h2 className="mt-4 text-lg font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
