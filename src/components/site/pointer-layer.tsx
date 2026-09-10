"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Constantes de movimento do protótipo (`prototype.html:241-250`). Ficam aqui
 * como constantes nomeadas, não espalhadas no corpo do loop: são a
 * especificação, e valor solto dentro de `tick()` vira número mágico na
 * primeira leitura de outra pessoa.
 */
const RING_LERP = 0.12;
const PREVIEW_LERP = 0.16;
/** Offset horizontal do preview em relação ao ponteiro (`prototype.html:242`). */
const PREVIEW_OFFSET_X = 34;
/**
 * Offset vertical. **Não são os −96 do protótipo.** Aqueles eram 60% dos 160px
 * de altura que o preview tinha lá, o que punha o ponteiro a 60% da altura da
 * peça. Com 116px de altura, preservar essa relação pede −70; manter −96
 * jogaria o ponteiro a 83%, quase na borda de baixo. O porquê da altura ter
 * mudado está em CLAUDE.md.
 */
const PREVIEW_OFFSET_Y = -70;
/** Velocidade horizontal → inclinação, com teto e decaimento do protótipo. */
const VEL_SMOOTH = 0.55;
const VEL_INPUT = 0.45;
const VEL_DECAY = 0.86;
const ROT_FACTOR = 0.5;
const ROT_MAX = 14;
const ROT_LERP = 0.12;
/**
 * Dimensões do preview. **240×116, não os 240×160 do protótipo**: lá o preview
 * era um retângulo de cor sólida, onde proporção é arbitrária. Com a imagem do
 * projeto dentro, 240×160 cortaria 26–28% da largura e tiraria a leitura de
 * "isso é um site". 240×116 dá ratio 2,069 contra mediana 2,073 das nove
 * imagens. Medições por imagem em CLAUDE.md.
 */
const PREVIEW_W = 240;
const PREVIEW_H = 116;

/**
 * Camada guiada pelo ponteiro: cursor (anel + ponto) e preview de projeto.
 *
 * **Um componente e um único `requestAnimationFrame` para as três peças**, como
 * no protótipo (`prototype.html:241-250`). Dois loops independentes competiriam
 * pelo mesmo quadro e dobrariam o custo de agendamento sem ganho nenhum.
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
export function PointerLayer() {
  const [mounted, setMounted] = useState(false);
  /**
   * Caminho da imagem do projeto sob o ponteiro. `null` até o primeiro hover —
   * é isso que garante que nenhuma das nove imagens entre no payload inicial.
   *
   * Este é o único estado que muda depois da montagem, e ele muda **uma vez por
   * projeto visitado**, não por quadro. O movimento continua fora do React.
   */
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

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
    const preview = previewRef.current;
    if (!dot || !ring || !preview) return;

    // Posição do ponteiro e posição perseguida pelo anel. Fora do React de
    // propósito: mudam a cada quadro e nenhuma delas pinta nada sozinha.
    let mx = -100;
    let my = -100;
    let rx = mx;
    let ry = my;
    let px = mx;
    let py = my;
    let vel = 0;
    let rot = 0;
    let hover = false;
    let sobreProjeto = false;

    // Último transform escrito em cada nó. É o que permite pular a escrita
    // quando o valor não mudou — ver o docblock.
    let lastDot = "";
    let lastRing = "";
    // A opacidade do anel muda só na virada do hover. Escrevê-la a cada
    // quadro seria uma terceira propriedade mutada 60x/s para permanecer
    // igual — e ela tem `transition`, então reescrever o mesmo valor não é
    // no-op garantido.
    let lastHover: boolean | null = null;
    let lastPreview = "";
    let lastPreviewTransform = "";
    let lastOn: boolean | null = null;
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
      // Média móvel do delta horizontal — é ela que inclina o preview.
      vel = vel * VEL_SMOOTH + (event.clientX - mx) * VEL_INPUT;
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

      const linha = target?.closest?.("[data-project-row]") as
        | HTMLElement
        | undefined;
      sobreProjeto = !!linha;
      const src = linha?.dataset.previewSrc;
      // `setState` só quando o projeto muda de fato. Sem esta comparação, cada
      // `pointerover` dentro da mesma linha (são quatro células) re-renderizaria.
      if (src && src !== lastPreview) {
        lastPreview = src;
        setPreviewSrc(src);
      }
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

      px += (mx + PREVIEW_OFFSET_X - px) * PREVIEW_LERP;
      py += (my + PREVIEW_OFFSET_Y - py) * PREVIEW_LERP;
      const alvo = Math.max(-ROT_MAX, Math.min(ROT_MAX, vel * ROT_FACTOR));
      rot += (alvo - rot) * ROT_LERP;
      vel *= VEL_DECAY;

      const previewTransform = `translate3d(${px.toFixed(2)}px, ${py.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg) scale(${sobreProjeto ? 1 : 0.9})`;
      if (previewTransform !== lastPreviewTransform) {
        preview!.style.transform = previewTransform;
        lastPreviewTransform = previewTransform;
      }
      if (sobreProjeto !== lastOn) {
        preview!.style.opacity = sobreProjeto ? "1" : "0";
        lastOn = sobreProjeto;
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
      {/* `aria-hidden`: o preview duplica o que a linha já diz por extenso.
          O fundo `--surface` (em `tokens.css`) é o **estado de carregamento** —
          ele cobre o vão entre o primeiro hover e a imagem chegar, sem
          skeleton e sem um segundo desenho para manter. */}
      <div ref={previewRef} data-preview aria-hidden="true">
        {previewSrc ? (
          <Image
            src={previewSrc}
            alt=""
            width={PREVIEW_W}
            height={PREVIEW_H}
            // As fontes têm ~1900px de largura e 2–4 MB. `next/image` serve
            // derivada no tamanho pedido; apontar para o arquivo cru baixaria
            // 4,2 MB no pior caso.
            sizes={`${PREVIEW_W}px`}
            draggable={false}
          />
        ) : null}
      </div>

      <div ref={ringRef} data-cursor-ring aria-hidden="true" />
      <div ref={dotRef} data-cursor-dot aria-hidden="true" />
    </>
  );
}
