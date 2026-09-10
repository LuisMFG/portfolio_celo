"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Constantes de movimento do protótipo (`prototype.html:241-250`). Ficam aqui
 * como constantes nomeadas, não espalhadas no corpo do loop: são a
 * especificação, e valor solto dentro de `tick()` vira número mágico na
 * primeira leitura de outra pessoa.
 */
const RING_LERP = 0.12;

/**
 * Cursor customizado — anel que persegue o ponteiro com atraso, mais um ponto
 * que o acompanha exato.
 *
 * **É o primeiro `requestAnimationFrame` contínuo do projeto**, e o risco
 * disso está registrado no CLAUDE.md desde a fase de fundação.
 *
 * ### Por que nada disso passa por estado do React
 *
 * O loop escreve direto em `element.style.transform`. Um `setState` por quadro
 * reconciliaria a árvore 60 vezes por segundo para mudar dois transforms —
 * o custo seria de React, não de animação, e não teria como ser otimizado
 * depois. Os dois nós são criados uma vez e mutados fora do ciclo do React.
 *
 * O único estado é `mounted`, e ele muda uma vez.
 *
 * ### O loop para quando converge
 *
 * `tick()` compara o transform novo com o último escrito e **só toca no DOM se
 * mudou**. Sem isso, um ponteiro parado ainda pagaria recálculo de estilo a
 * cada quadro para reescrever exatamente o mesmo valor.
 *
 * Isso importa mais do que parece: **o Lighthouse não move o mouse.** Numa
 * auditoria o alvo nunca muda, o lerp converge em poucos quadros e o loop
 * fica ocioso. Sem esta guarda o número da auditoria seria bom por acidente;
 * com ela, ele é bom porque não há trabalho a fazer. O custo real só aparece
 * com o ponteiro em movimento, e é isso que o profile manual mede.
 *
 * ### Quando o cursor não existe
 *
 * - **`pointer: coarse`** (toque): não monta. O ponteiro não existe para ser
 *   substituído, e o `cursor: none` deixaria o dispositivo sem nada.
 * - **`prefers-reduced-motion: reduce`**: não monta. Perseguição com lerp é
 *   movimento contínuo e não tem versão reduzida que faça sentido.
 *
 * As duas checagens rodam no efeito, então o HTML do servidor nunca contém o
 * cursor e o primeiro render do cliente é idêntico ao dele — a mesma regra do
 * guard `mounted` do controle de tema e do `TypedCommand`.
 *
 * ### `cursor: none` só quando isto monta
 *
 * Regra dura do projeto: nunca global no `<body>`. A classe entra no
 * `<html>` dentro do efeito e sai no cleanup. Sem JS, com toque ou sob
 * movimento reduzido, o ponteiro nativo continua lá.
 *
 * **Campos de formulário são exceção** — e esta é derivada, não do protótipo,
 * que não tinha formulário. Esconder o I-beam dentro de `<input>` e
 * `<textarea>` tira a única affordance que diz onde o texto vai cair. O
 * ponteiro nativo volta neles, e o cursor customizado continua desenhado por
 * cima. A regra vive em `tokens.css`.
 */
export function Cursor() {
  const [mounted, setMounted] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    setMounted(true);
    document.documentElement.classList.add("has-custom-cursor");

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Posição do ponteiro e posição perseguida pelo anel. Fora do React de
    // propósito: mudam a cada quadro e nenhuma delas pinta nada sozinha.
    let mx = -100;
    let my = -100;
    let rx = mx;
    let ry = my;
    let hover = false;

    // Último transform escrito em cada nó. É o que permite pular a escrita
    // quando o valor não mudou — ver o docblock.
    let lastDot = "";
    let lastRing = "";
    // A opacidade do anel muda só na virada do hover. Escrevê-la a cada
    // quadro seria uma terceira propriedade mutada 60x/s para permanecer
    // igual — e ela tem `transition`, então reescrever o mesmo valor não é
    // no-op garantido.
    let lastHover: boolean | null = null;
    let frame = 0;

    // As escalas de hover são lidas **uma vez**, do token, e viram número.
    //
    // A primeira versão punha `scale(var(--cursor-dot-hover))` direto no
    // transform inline, para não cravar 0.4 e 1.9 no componente. Medido com
    // trace do DevTools a 4x de CPU, 10s de mouse contínuo: **763ms de
    // recálculo de estilo e 41,7ms de Layout**, contra 30ms e 0ms sem o
    // cursor. Resolver custom property a cada quadro tira o transform do
    // caminho rápido do compositor — vira recálculo de estilo, e um elemento
    // `position: fixed` movido só por `transform` passou a provocar layout.
    //
    // Ler o token uma vez preserva a regra (o valor continua vindo de
    // `tokens.css`, não do componente) e devolve o transform ao compositor.
    const raiz = getComputedStyle(document.documentElement);
    const escala = (nome: string, padrao: number) => {
      const bruto = parseFloat(raiz.getPropertyValue(nome));
      return Number.isFinite(bruto) ? bruto : padrao;
    };
    const dotHover = escala("--cursor-dot-hover", 0.4);
    const ringHover = escala("--cursor-ring-hover", 1.9);
    const ringIdle = raiz.getPropertyValue("--cursor-ring-idle-opacity").trim() || "0.55";

    function onMove(event: PointerEvent) {
      mx = event.clientX;
      my = event.clientY;
    }

    // Delegação, não um listener por link: a lista de projetos vem do banco e
    // o rodapé pode mudar. `closest` resolve o alvo no evento, então nenhum
    // nó novo precisa ser registrado.
    //
    // **Seletor, não o `data-cursor="link"` do protótipo.** Lá o atributo foi
    // escrito à mão em nove elementos de um arquivo estático. Aqui os
    // interativos são dinâmicos (a lista vem do banco) e incluem controles
    // que o protótipo não tinha. Opt-in por atributo significaria lembrar de
    // marcar cada elemento novo, e esquecer não quebra nada visível — é o
    // tipo de regra que apodrece em silêncio.
    //
    // `input` e `textarea` ficam de fora porque eles recuperam o ponteiro
    // nativo (o I-beam), então não faz sentido reagir ao hover neles.
    function onOver(event: PointerEvent) {
      const target = event.target as Element | null;
      hover = !!target?.closest?.("a[href], button, [role='button']");
    }

    function tick() {
      rx += (mx - rx) * RING_LERP;
      ry += (my - ry) * RING_LERP;

      const dotTransform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%) scale(${hover ? dotHover : 1})`;
      const ringTransform = `translate3d(${rx.toFixed(2)}px, ${ry.toFixed(2)}px, 0) translate(-50%, -50%) scale(${hover ? ringHover : 1})`;

      if (dotTransform !== lastDot) {
        dot!.style.transform = dotTransform;
        lastDot = dotTransform;
      }
      if (ringTransform !== lastRing) {
        ring!.style.transform = ringTransform;
        lastRing = ringTransform;
      }
      if (hover !== lastHover) {
        ring!.style.opacity = hover ? "1" : ringIdle;
        lastHover = hover;
      }

      frame = requestAnimationFrame(tick);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      <div ref={ringRef} data-cursor-ring aria-hidden="true" />
      <div ref={dotRef} data-cursor-dot aria-hidden="true" />
    </>
  );
}
