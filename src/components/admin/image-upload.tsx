"use client";

import { useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { toast } from "sonner";

export type UploadedImageValue = {
  url: string;
  blobKey: string | null;
};

export function ImageUpload({
  value,
  onChange,
}: {
  value: UploadedImageValue;
  onChange: (next: UploadedImageValue) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function onPick(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.set("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Erro ao enviar imagem");
      }
      const data = (await res.json()) as { url: string; pathname: string };
      onChange({ url: data.url, blobKey: data.pathname });
      toast.success("Imagem enviada!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      {value.url && (
        <div className="relative w-full max-w-sm aspect-video rounded-md overflow-hidden border bg-muted">
          <Image
            src={value.url}
            alt="Preview"
            fill
            className="object-cover"
            unoptimized={value.url.startsWith("/")}
          />
          <button
            type="button"
            onClick={() => onChange({ url: "", blobKey: null })}
            className="absolute top-2 right-2 p-1 rounded-full bg-background/80 hover:bg-destructive hover:text-destructive-foreground transition-colors"
            aria-label="Remover imagem"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="h-4 w-4 mr-1" />
          {uploading ? "Enviando..." : value.url ? "Trocar imagem" : "Enviar imagem"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={onPick}
        />
        <span className="text-xs text-muted-foreground">
          JPG, PNG ou WebP até 5 MB
        </span>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">
          ou cole uma URL externa
        </label>
        <Input
          value={value.url}
          onChange={(e) => onChange({ url: e.target.value, blobKey: value.blobKey })}
          placeholder="https://..."
        />
      </div>
    </div>
  );
}
