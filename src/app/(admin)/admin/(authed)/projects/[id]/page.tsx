import { notFound } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { ProjectForm } from "@/src/components/admin/project-form";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.project.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Editar projeto</h1>
        <p className="text-muted-foreground mt-1">{item.titlePt}</p>
      </header>
      <ProjectForm
        initial={{
          id: item.id,
          slug: item.slug,
          image: item.image,
          imageBlobKey: item.imageBlobKey,
          technologies: item.technologies,
          githubUrl: item.githubUrl ?? "",
          liveUrl: item.liveUrl ?? "",
          order: item.order,
          titlePt: item.titlePt,
          titleEn: item.titleEn,
          descriptionPt: item.descriptionPt,
          descriptionEn: item.descriptionEn,
          isPublished: item.isPublished,
        }}
      />
    </div>
  );
}
