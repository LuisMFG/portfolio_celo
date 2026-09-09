"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/src/lib/utils";

/**
 * Números do protótipo (`prototype.html:165`, `:201`, `:207`), não estimativas.
 * O jitter de lá é `Math.random() * 46 - 12` — de -12ms a +34ms sobre a base.
 */
const TYPE_SPEED_MS = 28;
const JITTER_MIN_MS = -12;
const JITTER_MAX_MS = 34;
const REVEAL_THRESHOLD = 0.35;

type TypedCommandProps = {
  /** Linha inteira, como aparece no terminal. Ex.: `~/luis-marcelo $ whoami`. */
  text: string;
  className?: string;
};

/**
 * Linha de terminal digitada caractere a caractere (`prototype.html:142-143`).
 *
 * **`"use client"` é obrigatório aqui e o motivo é o gatilho**: a digitação
 * começa quando a linha entra no viewport (IntersectionObserver) e avança com
 * `setTimeout`. Nenhuma das duas coisas existe no servidor. Não há `rAF`,
 * Lenis nem cursor customizado — o único trabalho por caractere é um
 * `setState` de um inteiro.
 *
 * **Genérico de propósito.** Recebe a linha pronta por prop e não sabe nada
 * sobre a seção que o usa: as seções derivadas (sobre, stack, experiência,
 * contato) reaproveitam este mesmo componente mudando só o `text`.
 *
 * ### O primeiro render do cliente é idêntico ao do servidor
 *
 * `revealed` nasce em `text.length` — string inteira — e só cai para zero
 * dentro do `useEffect`, depois da hidratação. É a mesma armadilha do guard
 * `mounted` do controle de tema: estado inicial que difere do HTML do
 * servidor derruba a árvore hidratada inteira. De quebra isso é o
 * comportamento correto sem JS e sob `prefers-reduced-motion`, que saem pela
 * mesma porta: a linha completa, parada.
 *
 * ### A caixa nunca muda de tamanho
 *
 * O texto não digitado continua no DOM, transparente, no lugar exato onde
 * vai aparecer. Sem isso a linha cresceria de zero à largura final e, a
 * 375px, ganharia uma segunda linha no meio da digitação — CLS puro, num
 * projeto cujo piso é 0.001.
 *
 * Manter o resto no DOM também resolve a acessibilidade: o leitor de tela
 * encontra `~/luis-marcelo $ ls ./projects --all` inteiro, em ordem, em
 * qualquer instante da animação. Nada de `aria-live` — o texto não é um
 * anúncio, e mutação sem live region não é narrada.
 *
 * O cursor é o único elemento que não pode entrar no fluxo: um `inline-block`
 * entre os dois trechos criaria oportunidade de quebra de linha no meio de
 * uma palavra e mudaria onde o texto quebra conforme ele avança. Por isso ele
 * é absoluto dentro de uma âncora inline vazia, que não ocupa largura nem
 * cria ponto de quebra. O layout do texto é, em todo quadro, o mesmo da
 * string completa.
 */
export function TypedCommand({ text, className }: TypedCommandProps) {
  const [revealed, setRevealed] = useState(text.length);
  const hostRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Sem movimento a linha já está completa desde o servidor: nada a fazer,
    // nenhum observer a criar.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setRevealed(0);

    let timer: ReturnType<typeof setTimeout> | undefined;

    const type = (i: number) => {
      setRevealed(i);
      if (i >= text.length) return;
      timer = setTimeout(
        () => type(i + 1),
        TYPE_SPEED_MS + JITTER_MIN_MS + Math.random() * (JITTER_MAX_MS - JITTER_MIN_MS),
      );
    };

    // `threshold` do protótipo (`:207`), mas observando a própria linha e não
    // a seção: a seção tem `py-section-lg` dos dois lados e 35% da área dela
    // já estão visíveis antes de o texto chegar perto do fundo da tela.
    // Observar a linha faz a digitação começar quando ela é de fato vista.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.disconnect();
          type(0);
        }
      },
      { threshold: REVEAL_THRESHOLD },
    );

    observer.observe(host);

    // Sair da página no meio da digitação deixaria um timer órfão chamando
    // `setState` em componente desmontado, e o observer segurando o nó.
    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [text]);

  return (
    <p
      ref={hostRef}
      data-typed
      className={cn(
        "min-h-command whitespace-pre-wrap break-words text-command text-term-text",
        className,
      )}
    >
      {text.slice(0, revealed)}
      <span data-caret-anchor aria-hidden="true">
        <span data-caret data-blink />
      </span>
      {/* Fantasma: mesmo texto, mesma posição, sem tinta. Segura a caixa e
          entrega a linha inteira ao leitor de tela. */}
      <span data-caret-ghost>{text.slice(revealed)}</span>
    </p>
  );
}
