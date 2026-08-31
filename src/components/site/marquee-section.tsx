import { getTranslations } from "next-intl/server";

/**
 * A pilha real, na ordem do protótipo (`prototype.html:95`).
 *
 * O protótipo lista dez itens e a fonte do conteúdo — `src/components/
 * technologies.tsx` — lista onze; a interseção não é total nos dois sentidos.
 * O protótipo acrescenta NestJS (que é real: aparece na descrição do cargo na
 * Biggelo, em `messages/*.json`) e deixa de fora Tailwind e Git. Redesign é
 * visual, então nada de conteúdo se perde: as duas voltam, encaixadas onde a
 * ordem do protótipo já agrupava — Tailwind fecha a corrida de front-end,
 * antes do bloco .NET/Spring, e Git fecha a de infraestrutura.
 *
 * A grafia é a da fonte (`Node.js`, `.NET`), não o caixa-alta do desenho: o
 * versalete é `text-transform`, então leitor de tela, busca e cópia do usuário
 * recebem o nome como ele se escreve.
 */
const TECHNOLOGIES = [
  "Node.js",
  "NestJS",
  "TypeScript",
  "Next.js",
  "React",
  "Angular",
  "Tailwind",
  ".NET",
  "Spring",
  "Docker",
  "PostgreSQL",
  "Git",
] as const;

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
 * uma cópia, então o último quadro coincide com o primeiro. A segunda cópia é
 * `aria-hidden` — é redundância visual, não informação — e os `·` também, para
 * a lista ser lida como lista e não como pontuação.
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
export async function MarqueeSection({
  items = TECHNOLOGIES,
}: MarqueeSectionProps) {
  // Reaproveita o rótulo que já existe traduzido ("Tecnologias" / "Technologies")
  // em vez de inventar chave nova. Dá nome à região: sem ele a seção seria um
  // bloco de texto anônimo, e o `aria-label` é o único texto da faixa que não é
  // nome próprio.
  const t = await getTranslations("SkillsSection");

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
      aria-label={t("title")}
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
