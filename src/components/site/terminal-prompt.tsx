import { cn } from "@/src/lib/utils";

interface TerminalPromptProps {
  /** Caminho da sessão, em `--accent`. Ex.: `~/luis-marcelo`. */
  path: string;
  /** Comando digitado, em `--text`. Ex.: `whoami`. */
  command: string;
  className?: string;
}

/**
 * Linha de prompt do protótipo (`prototype.html:80-85`): caminho em acento,
 * `$` em muted, comando em texto e o cursor piscando.
 *
 * Server component: o piscar é `@keyframes` puro (`[data-blink]` em
 * tokens.css), sem estado nem timer em JS — foi assim que o hero antigo
 * gastava dois `setInterval` só para acender um traço.
 *
 * O `_` é `aria-hidden`: é enfeite de terminal, e lido em voz alta viraria
 * "sublinhado" no meio da frase. O leitor de tela ouve
 * "~/luis-marcelo $ whoami".
 */
export function TerminalPrompt({
  path,
  command,
  className,
}: TerminalPromptProps) {
  return (
    <span className={cn("flex items-center gap-2.5 text-prompt", className)}>
      <span className="text-term-accent">{path}</span>
      <span className="text-term-muted">$</span>
      <span className="text-term-text">{command}</span>
      <span aria-hidden="true" data-blink className="text-term-accent">
        _
      </span>
    </span>
  );
}
