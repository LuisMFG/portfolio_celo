import { notFound } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { ExperienceForm } from "@/src/components/admin/experience-form";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.experience.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Editar experiência</h1>
        <p className="text-muted-foreground mt-1">{item.titlePt}</p>
      </header>
      <ExperienceForm
        initial={{
          id: item.id,
          type: item.type as "professional" | "academic",
          order: item.order,
          titlePt: item.titlePt,
          titleEn: item.titleEn,
          companyPt: item.companyPt,
          companyEn: item.companyEn,
          periodPt: item.periodPt,
          periodEn: item.periodEn,
          descriptionPt: item.descriptionPt,
          descriptionEn: item.descriptionEn,
          isPublished: item.isPublished,
        }}
      />
    </div>
  );
}
