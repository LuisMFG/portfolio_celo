import { prisma } from "@/src/lib/prisma";
import { SectionContentForm } from "@/src/components/admin/section-content-form";

const FIELDS = [
  { name: "greeting", label: "Saudação", type: "input" as const },
  { name: "subtitle", label: "Subtítulo", type: "input" as const },
  { name: "description", label: "Descrição", type: "textarea" as const },
];

export default async function HeroAdminPage() {
  const rows = await prisma.siteContent.findMany({ where: { section: "hero" } });

  const initial = {
    "pt-BR": { greeting: "", subtitle: "", description: "" },
    en: { greeting: "", subtitle: "", description: "" },
  };
  for (const r of rows) {
    if (r.locale === "pt-BR" || r.locale === "en") {
      initial[r.locale][r.field as keyof (typeof initial)["pt-BR"]] = r.value;
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Hero</h1>
        <p className="text-muted-foreground mt-1">
          Saudação, subtítulo e descrição que aparecem na primeira tela.
        </p>
      </header>
      <SectionContentForm section="hero" fields={FIELDS} initial={initial} />
    </div>
  );
}
