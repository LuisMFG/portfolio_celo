"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Switch } from "@/src/components/ui/switch";
import { toast } from "sonner";

type ExperienceData = {
  id?: string;
  type: "professional" | "academic";
  order: number;
  titlePt: string;
  titleEn: string;
  companyPt: string;
  companyEn: string;
  periodPt: string;
  periodEn: string;
  descriptionPt: string;
  descriptionEn: string;
  isPublished: boolean;
};

const EMPTY: ExperienceData = {
  type: "professional",
  order: 0,
  titlePt: "",
  titleEn: "",
  companyPt: "",
  companyEn: "",
  periodPt: "",
  periodEn: "",
  descriptionPt: "",
  descriptionEn: "",
  isPublished: true,
};

export function ExperienceForm({ initial }: { initial?: ExperienceData }) {
  const router = useRouter();
  const isEdit = !!initial?.id;
  const [data, setData] = useState<ExperienceData>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof ExperienceData>(key: K, value: ExperienceData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = isEdit
        ? `/api/admin/experiences/${initial!.id}`
        : "/api/admin/experiences";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: data.type,
          order: Number(data.order) || 0,
          titlePt: data.titlePt,
          titleEn: data.titleEn,
          companyPt: data.companyPt,
          companyEn: data.companyEn,
          periodPt: data.periodPt,
          periodEn: data.periodEn,
          descriptionPt: data.descriptionPt,
          descriptionEn: data.descriptionEn,
          isPublished: data.isPublished,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Erro ao salvar");
      }
      toast.success(isEdit ? "Atualizado!" : "Criado!");
      router.push("/admin/experiences");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3 rounded-lg border bg-card p-4">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <Select
            value={data.type}
            onValueChange={(v) => set("type", v as ExperienceData["type"])}
          >
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Profissional</SelectItem>
              <SelectItem value="academic">Acadêmica</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="order">Ordem</Label>
          <Input
            id="order"
            type="number"
            min={0}
            value={data.order}
            onChange={(e) => set("order", Number(e.target.value))}
          />
        </div>
        <div className="flex items-center gap-3 pt-7">
          <Switch
            id="isPublished"
            checked={data.isPublished}
            onCheckedChange={(v) => set("isPublished", v)}
          />
          <Label htmlFor="isPublished">Publicada</Label>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {(["pt-BR", "en"] as const).map((locale) => {
          const sfx = locale === "pt-BR" ? "Pt" : "En";
          return (
            <div key={locale} className="space-y-4 rounded-lg border bg-card p-4">
              <h3 className="font-semibold">
                {locale === "pt-BR" ? "🇧🇷 Português" : "🇺🇸 English"}
              </h3>
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={data[`title${sfx}` as const]}
                  onChange={(e) => set(`title${sfx}` as const, e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Empresa / Instituição</Label>
                <Input
                  value={data[`company${sfx}` as const]}
                  onChange={(e) => set(`company${sfx}` as const, e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Período</Label>
                <Input
                  value={data[`period${sfx}` as const]}
                  onChange={(e) => set(`period${sfx}` as const, e.target.value)}
                  placeholder={locale === "pt-BR" ? "ex: jan de 2025 - Presente" : "ex: Jan 2025 - Present"}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  rows={5}
                  value={data[`description${sfx}` as const]}
                  onChange={(e) => set(`description${sfx}` as const, e.target.value)}
                  required
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/experiences")}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Salvando..." : isEdit ? "Salvar" : "Criar"}
        </Button>
      </div>
    </form>
  );
}
