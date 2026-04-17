"use client";

import { useRef, useState, useCallback, useEffect, type ChangeEvent, type DragEvent } from "react";
import Image from "next/image";
import { Upload, X, ImageIcon } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { toast } from "sonner";

export type UploadedImageValue = {
  url: string;
  blobKey: string | null;
};

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function ImageUpload({
  value,
  onChange,
}: {
  value: UploadedImageValue;
  onChange: (next: UploadedImageValue) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = useCallback(async (file: File) => {
    if (!ACCEPTED_TYPES.has(file.type)) {
      toast.error("Tipo inválido. Use JPG, PNG ou WebP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Imagem maior que 5 MB.");
      return;
    }
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
    }
  }, [onChange]);

  function onPick(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadFile(file);
    if (inputRef.current) inputRef.current.value = "";
  }

  function onDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }

  function onDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  useEffect(() => {
    function onPaste(e: ClipboardEvent) {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) uploadFile(file);
          return;
        }
      }
    }
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, [uploadFile]);

  return (
    <div className="space-y-3">
      {value.url ? (
        <div className="relative w-full max-w-sm aspect-video rounded-md overflow-hidden border bg-muted">
          <Image
            src={value.url}
            alt="Preview"
            fill
            className="object-cover"
            unoptimized
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
      ) : (
        <div
          ref={dropRef}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`
            flex flex-col items-center justify-center gap-2 w-full max-w-sm aspect-video
            rounded-md border-2 border-dashed cursor-pointer transition-colors
            ${dragOver
              ? "border-primary bg-primary/10"
              : "border-muted-foreground/30 hover:border-primary/50 bg-muted/50"
            }
            ${uploading ? "pointer-events-none opacity-60" : ""}
          `}
        >
          {uploading ? (
            <p className="text-sm text-muted-foreground">Enviando...</p>
          ) : (
            <>
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center px-4">
                Arraste uma imagem, cole com <kbd className="px-1 py-0.5 rounded bg-muted text-xs font-mono">Ctrl+V</kbd> ou clique para selecionar
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG ou WebP até 5 MB
              </p>
            </>
          )}
        </div>
      )}

      {value.url && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-1" />
            {uploading ? "Enviando..." : "Trocar imagem"}
          </Button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onPick}
      />

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">
          ou cole uma URL externa
        </label>
        <Input
          value={value.url}
          onChange={(e) => onChange({ url: e.target.value, blobKey: null })}
          placeholder="https://..."
        />
      </div>
    </div>
  );
}
