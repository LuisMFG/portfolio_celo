"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Switch } from "@/src/components/ui/switch";
import { TechnologiesInput } from "./technologies-input";
import { ImageUpload } from "./image-upload";
import { toast } from "sonner";

export type ProjectData = {
  id?: string;
  slug: string;
  image: string;
  imageBlobKey: string | null;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  order: number;
  titlePt: string;
  titleEn: string;
  descriptionPt: string;
  descriptionEn: string;
  isPublished: boolean;
};

const EMPTY: ProjectData = {
  slug: "",
  image: "",
  imageBlobKey: null,
  technologies: [],
  githubUrl: "",
  liveUrl: "",
  order: 0,
  titlePt: "",
  titleEn: "",
  descriptionPt: "",
  descriptionEn: "",
  isPublished: true,
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

export function ProjectForm({ initial }: { initial?: ProjectData }) {
  const router = useRouter();
  const isEdit = !!initial?.id;
  const [data, setData] = useState<ProjectData>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof ProjectData>(key: K, value: ProjectData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function onTitlePtBlur() {
    if (!data.slug && data.titlePt) {
      set("slug", slugify(data.titlePt));
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!data.image) {
      toast.error("Imagem obrigatória");
      return;
    }
    setSaving(true);
    try {
      const url = isEdit ? `/api/admin/projects/${initial!.id}` : "/api/admin/projects";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: data.slug,
          image: data.image,
          imageBlobKey: data.imageBlobKey ?? null,
          technologies: data.technologies,
          githubUrl: data.githubUrl,
          liveUrl: data.liveUrl,
          order: Number(data.order) || 0,
          titlePt: data.titlePt,
          titleEn: data.titleEn,
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
      router.push("/admin/projects");
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
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input
            id="slug"
            value={data.slug}
            onChange={(e) => set("slug", e.target.value)}
            placeholder="meu-projeto"
            pattern="[a-z0-9\-]+"
            required
          />
          <p className="text-xs text-muted-foreground">
            Apenas letras minúsculas, números e hífens.
          </p>
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

        <div className="space-y-2">
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input
            id="githubUrl"
            value={data.githubUrl}
            onChange={(e) => set("githubUrl", e.target.value)}
            placeholder="https://github.com/..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="liveUrl">Live URL</Label>
          <Input
            id="liveUrl"
            value={data.liveUrl}
            onChange={(e) => set("liveUrl", e.target.value)}
            placeholder="https://..."
          />
        </div>
        <div className="flex items-center gap-3 pt-7">
          <Switch
            id="isPublished"
            checked={data.isPublished}
            onCheckedChange={(v) => set("isPublished", v)}
          />
          <Label htmlFor="isPublished">Publicado</Label>
        </div>

        <div className="space-y-2 md:col-span-3">
          <Label>Imagem</Label>
          <ImageUpload
            value={{ url: data.image, blobKey: data.imageBlobKey }}
            onChange={(v) => {
              set("image", v.url);
              set("imageBlobKey", v.blobKey);
            }}
          />
        </div>

        <div className="space-y-2 md:col-span-3">
          <Label>Tecnologias</Label>
          <TechnologiesInput
            value={data.technologies}
            onChange={(v) => set("technologies", v)}
          />
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
                  onBlur={locale === "pt-BR" ? onTitlePtBlur : undefined}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  rows={6}
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
          onClick={() => router.push("/admin/projects")}
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
