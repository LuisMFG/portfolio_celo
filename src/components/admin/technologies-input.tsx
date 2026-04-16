"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";

export function TechnologiesInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const [input, setInput] = useState("");

  function add(raw: string) {
    const v = raw.trim();
    if (!v) return;
    if (value.includes(v)) {
      setInput("");
      return;
    }
    onChange([...value, v]);
    setInput("");
  }

  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(input);
    } else if (e.key === "Backspace" && !input && value.length) {
      remove(value.length - 1);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {value.map((tech, i) => (
          <Badge key={`${tech}-${i}`} variant="secondary" className="gap-1">
            {tech}
            <button
              type="button"
              onClick={() => remove(i)}
              className="hover:text-destructive"
              aria-label={`Remover ${tech}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => input && add(input)}
        placeholder="Digite uma tecnologia e pressione Enter"
      />
    </div>
  );
}
