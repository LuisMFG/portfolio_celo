import { MARQUEE_ORDER } from "@/src/lib/stack";


type MarqueeSectionProps = {
  /** Sobrescreve a pilha exibida. Só existe para teste e reuso. */
  items?: readonly string[];
};

/**
 * Faixa de tecnologias do protótipo (`prototype.html:93-98`).
 *
 * Server component: o loop inteiro é um `@keyframes` e a freada no hover é um
 * `:hover` em CSS. O protótipo precisava de JS só porque a duração era prop
 * ajustável no editor — aqui ela é token. Zero bytes no cliente.
 *
 * O conteúdo é duplicado de propósito: `translate3d(-50%)` desloca exatamente
 * uma cópia, então o último quadro coincide com o primeiro.
 *
 * ### A faixa inteira é `aria-hidden`, e isso é uma reversão deliberada
 *
 * Ela nasceu como landmark `region` nomeada por `aria-label`, porque era a
 * única portadora da lista de tecnologias. **A seção "stack" passou a listar
 * as mesmas doze**, e aí a faixa virou dois defeitos de uma vez: doze itens
 * duplicados na árvore de acessibilidade e uma segunda `region` com o mesmo
 * nome ("Tecnologias") — indistinguível da outra numa lista de landmarks.
 *
 * Sem informação exclusiva, ela é textura. `aria-hidden` numa faixa de texto
 * visível só é legítimo sob essa condição, e a condição é verificada em vez de
 * suposta: `STACK_COVERS_MARQUEE`, em `src/lib/stack.ts`, quebra o build se um
 * dos lados ganhar tecnologia que o outro não tem. A faixa também não tem
 * nenhum elemento focável, que é o outro requisito de `aria-hidden`.
 *
 * O `aria-hidden` da cópia-eco e o dos `·` ficam por redundância: se alguém um
 * dia devolver a faixa à árvore, eles continuam corretos sozinhos.
 *
 * A faixa sangra de ponta a ponta, sem gutter: é a única seção que ignora a
 * margem lateral, e é isso que faz a régua do grid parecer interrompida.
 *
 * Decisão de 375px: **nada muda além do que os `clamp()` já fazem.** A faixa
 * continua full-bleed e em uma linha só, porque a largura do trilho escala
 * junto com a fonte (1.4rem no mobile contra até 3.4rem no desktop) enquanto
 * a duração é constante — a velocidade aparente em telas por segundo se
 * mantém, e o texto não fica nem apressado nem arrastado. Não há o que
 * espremer: o corte pelas bordas é o desenho, não um efeito colateral. As
 * duas únicas consequências mobile foram tratadas fora do desenho: o `hover`
 * ficou atrás de `@media (hover: hover)` para não grudar depois do tap, e o
 * recorte usa `clip` para não virar contêiner de scroll horizontal.
 */
export function MarqueeSection({
  items = MARQUEE_ORDER,
}: MarqueeSectionProps) {
  const run = (echo: boolean) => (
    <ul
      data-marquee-list
      {...(echo ? { "data-marquee-echo": "", "aria-hidden": true } : {})}
      className="flex text-marquee font-light uppercase"
    >
      {items.map((name) => (
        <li key={name} className="shrink-0 whitespace-nowrap">
          {name}
          {/* Separador depois de cada item, inclusive o último: é ele que
              costura a emenda entre a última tecnologia de uma cópia e a
              primeira da seguinte. */}
          <span
            data-marquee-sep
            aria-hidden="true"
            className="px-marquee-sep text-term-accent"
          >
            ·
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <section
      data-marquee
      aria-hidden="true"
      className="border-y border-term-line bg-term-surface py-marquee [overflow-x:clip]"
    >
      {/* `w-max` explícito: o trilho é `inline-flex` no protótipo e depende de
          shrink-to-fit chegar em max-content por causa do `nowrap` dos filhos.
          Funciona, mas por acidente — e se falhasse, `-50%` passaria a ser
          metade do viewport e o loop ganharia costura. */}
      <div data-marquee-track className="flex w-max">
        {run(false)}
        {run(true)}
      </div>
    </section>
  );
}
