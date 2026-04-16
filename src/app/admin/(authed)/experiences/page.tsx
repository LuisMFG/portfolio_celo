import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/src/lib/prisma";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { DeleteButton } from "@/src/components/admin/delete-button";

export default async function ExperiencesAdminPage() {
  const items = await prisma.experience.findMany({
    orderBy: [{ type: "asc" }, { order: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Experiências</h1>
          <p className="text-muted-foreground mt-1">
            {items.length} cadastrada{items.length === 1 ? "" : "s"}.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/experiences/new">
            <Plus className="h-4 w-4 mr-1" />
            Nova
          </Link>
        </Button>
      </header>

      <div className="space-y-3">
        {items.length === 0 && (
          <p className="text-muted-foreground">Nenhuma experiência ainda.</p>
        )}
        {items.map((e) => (
          <div
            key={e.id}
            className="rounded-lg border bg-card p-4 flex items-start justify-between gap-4"
          >
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold truncate">{e.titlePt}</h3>
                <Badge variant={e.type === "professional" ? "default" : "secondary"}>
                  {e.type === "professional" ? "Profissional" : "Acadêmica"}
                </Badge>
                {!e.isPublished && <Badge variant="outline">Rascunho</Badge>}
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {e.companyPt} · {e.periodPt}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button asChild size="sm" variant="outline">
                <Link href={`/admin/experiences/${e.id}`}>
                  <Pencil className="h-4 w-4 mr-1" />
                  Editar
                </Link>
              </Button>
              <DeleteButton
                url={`/api/admin/experiences/${e.id}`}
                confirmText={`Excluir "${e.titlePt}"?`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
