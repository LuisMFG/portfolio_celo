import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Github, ExternalLink } from "lucide-react";
import { prisma } from "@/src/lib/prisma";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { DeleteButton } from "@/src/components/admin/delete-button";

export default async function ProjectsAdminPage() {
  const items = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projetos</h1>
          <p className="text-muted-foreground mt-1">
            {items.length} cadastrado{items.length === 1 ? "" : "s"}.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="h-4 w-4 mr-1" />
            Novo
          </Link>
        </Button>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {items.length === 0 && (
          <p className="text-muted-foreground">Nenhum projeto ainda.</p>
        )}
        {items.map((p) => (
          <div key={p.id} className="rounded-lg border bg-card overflow-hidden">
            <div className="relative aspect-video bg-muted">
              {p.image && (
                <Image
                  src={p.image}
                  alt={p.titlePt}
                  fill
                  className="object-cover"
                  unoptimized={p.image.startsWith("/")}
                />
              )}
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold truncate">{p.titlePt}</h3>
                {!p.isPublished && <Badge variant="outline">Rascunho</Badge>}
              </div>
              <p className="text-xs text-muted-foreground">/{p.slug}</p>
              <div className="flex flex-wrap gap-1">
                {p.technologies.slice(0, 4).map((t) => (
                  <Badge key={t} variant="secondary" className="text-xs">
                    {t}
                  </Badge>
                ))}
                {p.technologies.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{p.technologies.length - 4}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-xs pt-1">
                {p.githubUrl && <Github className="h-4 w-4" />}
                {p.liveUrl && <ExternalLink className="h-4 w-4" />}
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/admin/projects/${p.id}`}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Editar
                  </Link>
                </Button>
                <DeleteButton
                  url={`/api/admin/projects/${p.id}`}
                  confirmText={`Excluir "${p.titlePt}"?`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
