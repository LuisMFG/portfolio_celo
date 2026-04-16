"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { toast } from "sonner";

export function DeleteButton({
  url,
  redirectTo,
  confirmText = "Tem certeza?",
}: {
  url: string;
  redirectTo?: string;
  confirmText?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    if (!confirm(confirmText)) return;
    setLoading(true);
    try {
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Erro ao excluir");
      }
      toast.success("Excluído!");
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      onClick={onDelete}
      disabled={loading}
    >
      <Trash2 className="h-4 w-4 mr-1" />
      {loading ? "Excluindo..." : "Excluir"}
    </Button>
  );
}
