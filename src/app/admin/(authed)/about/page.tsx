import { prisma } from "@/src/lib/prisma";
import { SectionContentForm } from "@/src/components/admin/section-content-form";

const FIELDS = [
  { name: "paragraph1", label: "Parágrafo 1", type: "textarea" as const },
  { name: "paragraph2", label: "Parágrafo 2", type: "textarea" as const },
];

export default async function AboutAdminPage() {
  const rows = await prisma.siteContent.findMany({ where: { section: "about" } });

  const initial = {
    "pt-BR": { paragraph1: "", paragraph2: "" },
    en: { paragraph1: "", paragraph2: "" },
  };
  for (const r of rows) {
    if (r.locale === "pt-BR" || r.locale === "en") {
      initial[r.locale][r.field as keyof (typeof initial)["pt-BR"]] = r.value;
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Sobre Mim</h1>
        <p className="text-muted-foreground mt-1">
          Parágrafos da seção &quot;Sobre Mim&quot;.
        </p>
      </header>
      <SectionContentForm section="about" fields={FIELDS} initial={initial} />
    </div>
  );
}
