"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { toast } from "sonner";

type Locale = "pt-BR" | "en";
type Values = Record<Locale, Record<string, string>>;

type FieldType = "input" | "textarea";

type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
};

export function SectionContentForm({
  section,
  fields,
  initial,
}: {
  section: "hero" | "about";
  fields: FieldDef[];
  initial: Values;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Values>(initial);
  const [saving, setSaving] = useState(false);

  function update(locale: Locale, name: string, value: string) {
    setValues((v) => ({ ...v, [locale]: { ...v[locale], [name]: value } }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/content/${section}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Erro ao salvar");
      }
      toast.success("Salvo!");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {(["pt-BR", "en"] as const).map((locale) => (
          <div key={locale} className="space-y-4 rounded-lg border bg-card p-4">
            <h3 className="font-semibold">
              {locale === "pt-BR" ? "🇧🇷 Português" : "🇺🇸 English"}
            </h3>
            {fields.map((f) => (
              <div key={f.name} className="space-y-2">
                <Label htmlFor={`${locale}-${f.name}`}>{f.label}</Label>
                {f.type === "textarea" ? (
                  <Textarea
                    id={`${locale}-${f.name}`}
                    value={values[locale][f.name] ?? ""}
                    onChange={(e) => update(locale, f.name, e.target.value)}
                    rows={6}
                    required
                  />
                ) : (
                  <Input
                    id={`${locale}-${f.name}`}
                    value={values[locale][f.name] ?? ""}
                    onChange={(e) => update(locale, f.name, e.target.value)}
                    required
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}
