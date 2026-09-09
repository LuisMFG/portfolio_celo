import { getTranslations } from "next-intl/server";

/**
 * Seção "sobre". **Não existe no protótipo** — ele vai de hero a marquee a
 * lista de projetos a comando, sem nenhum bloco de prosa. Ela é derivada, e
 * cada empréstimo está anotado abaixo.
 *
 * Server component: nenhum estado, nenhum evento, zero JS de cliente. Também
 * nenhuma entrada animada, pela mesma razão registrada na lista de projetos —
 * o protótipo só anima o hero, e entrada por scroll pede IntersectionObserver,
 * que é a fase de movimento.
 *
 * ### O que foi emprestado de onde
 *
 * - **Cabeçalho de dois rótulos de 11px** (`prototype.html:101`), com o vão de
 *   `pb-projects-head` até o conteúdo. À esquerda o `<h2>`; à direita o
 *   `whoami` do hero.
 * - **Sem régua sob o cabeçalho.** É a gramática da seção comando
 *   (`prototype.html:141`), não a da lista: régua ali fecha um `<ol>`, e isto
 *   é prosa. A única régua da seção é a que separa a prosa do dado, no fim.
 * - **Fundo `--bg`, e por isso nenhuma régua própria.** Régua marca troca de
 *   superfície, não fronteira de seção (a regra está em CLAUDE.md, em
 *   "Espaço"). Esta seção não troca de fundo, então não leva `border-top` — e
 *   o vão de até 280px até a lista de projetos é o separador, não descuido.
 *   A única régua daqui separa prosa de dado, dentro da seção.
 *
 * ### O `whoami` vem do hero, não de uma cópia
 *
 * `HeroSection.prompt.command` é a mesma string que o prompt do hero desenha,
 * e a seção é literalmente a resposta a ele. Mesma decisão do `prompt.path`
 * reaproveitado pela `CommandSection`: duas cópias divergiriam na primeira
 * edição de um lado só. O `$` é o glifo de prompt do protótipo e é
 * `aria-hidden` — lido em voz alta viraria "cifrão" antes do comando.
 *
 * ### A localização é requisito, não enfeite
 *
 * O header esconde `porto velho · ro` abaixo de 768px (a decisão está no
 * `SiteHeader`), e a consequência registrada é que esta seção passa a ser a
 * única a carregá-la. Ela entra como `<dl>` porque é de fato um par
 * termo/definição, com o rótulo vindo de `ContactSection.location` — traduzido
 * de verdade, nenhuma copy nova — e o valor de `Header.location`, a mesma
 * string que o header desenha.
 *
 * O `·` do valor fica visível para o leitor de tela: ele vive dentro de uma
 * string traduzida única e separá-lo exigiria inventar duas chaves.
 *
 * ### Decisão de 375px: nenhum colapso estrutural
 *
 * Diferente da lista de projetos, aqui não há grid para reprojetar — é uma
 * coluna de prosa. Medido com o advance de 0.6em da JetBrains Mono contra os
 * 335px de linha útil: o par do cabeçalho pede 166px (79 + 70 + 16 de gap) e o
 * par de localização, 254px (97 + 141 + 16). Os dois cabem inteiros.
 *
 * A prosa no piso de 0.9rem dá 38,8 colunas por linha, e a medida de 72ch só
 * morde acima de ~830px de coluna — no mobile ela é inerte. O `flex-wrap` dos
 * dois pares é rede, não layout: nas larguras onde tudo cabe ele nunca dispara.
 */
export async function AboutSection() {
  const t = await getTranslations("AboutSection");
  const tHero = await getTranslations("HeroSection");
  const tContact = await getTranslations("ContactSection");
  const tHeader = await getTranslations("Header");

  return (
    <section
      aria-labelledby="about-title"
      className="relative z-10 px-gutter py-section"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-4 pb-projects-head text-label-wide uppercase text-term-muted">
        <h2 id="about-title" className="font-normal">
          {t("title")}
        </h2>
        <span>
          <span aria-hidden="true">{"$ "}</span>
          {tHero("prompt.command")}
        </span>
      </div>

      {/* `text-body` no contêiner, não em cada `<p>`: `max-w-about` (72ch) e
          `gap-about-para` (uma linha) são unidades relativas à fonte e
          resolvem contra ele. */}
      <div className="flex max-w-about flex-col gap-about-para text-body text-term-text">
        <p>{t("paragraph1")}</p>
        <p>{t("paragraph2")}</p>
      </div>

      <dl className="mt-about-meta flex flex-wrap items-baseline justify-between gap-4 border-t border-term-line pt-about-meta text-label-wide uppercase text-term-muted">
        <dt>{tContact("location")}</dt>
        <dd>{tHeader("location")}</dd>
      </dl>
    </section>
  );
}
