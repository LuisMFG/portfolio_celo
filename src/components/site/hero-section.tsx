import { getTranslations } from "next-intl/server";
import { TerminalPrompt } from "./terminal-prompt";

/**
 * Hero do protótipo (`prototype.html:45-91`).
 *
 * Server component: entrada, piscar e dica de scroll são todos `@keyframes`
 * do `.theme-terminal`. Nenhum estado, nenhum evento, zero JS no cliente —
 * o hero antigo custava framer-motion mais dois `setInterval` para o mesmo
 * efeito.
 *
 * Layout: o protótipo distribui header, nome e rodapé de tela com
 * `space-between` dentro de uma section de 100vh. Aqui o header é irmão
 * (fica fora do `<main>` para continuar sendo landmark `banner`), então a
 * distribuição equivalente vem de `my-auto` no bloco de nome: as margens
 * automáticas comem o espaço livre antes do `justify-between` e centram o
 * nome no que sobra, com o rodapé colado embaixo. Mesmo resultado visual,
 * mesma assimetria de 2vh vinda do par `pt-hero-top` / `pb-hero-bottom`.
 *
 * Decisão de 375px: o nome cabe sem reprojeto — "MARCELO" a 3.5rem em
 * JetBrains Mono mede ~235px contra 335px de linha útil — então o display
 * fica intocado. Some só o indicador de scroll (`hidden md:flex`): dividir
 * a linha de baixo com o prompt forçaria wrap e quebraria o ritmo do
 * `space-between`, e num aparelho de toque a rolagem não precisa de convite.
 * Colapso por media query, nunca por render condicional.
 */
export async function HeroSection() {
  const t = await getTranslations("HeroSection");

  return (
    <section className="flex flex-1 flex-col justify-between px-gutter pb-8">
      {/* Coluna flex com `gap`, não margem: `.term-clip` já usa margem
          negativa para abrir o recorte, e um `mt-` no mesmo elemento seria
          sobrescrito por ela. O gap também dispensa colapso de margem. */}
      <div className="my-auto flex flex-col gap-hero-lead pb-hero-bottom pt-hero-top">
        {/* Um único `<h1>` com duas linhas em bloco — o protótipo usa dois
            `<h1>`, o que daria dois títulos de página ao leitor de tela. O
            espaço entre os blocos é colapsado no desenho e preservado no
            texto acessível: "LUÍS MARCELO". */}
        <h1 className="flow-root text-display font-medium">
          <span className="term-clip block">
            <span data-rise data-rise-display data-delay="d" className="block">
              {t("name.first")}
            </span>
          </span>{" "}
          <span className="term-clip block">
            <span data-rise data-rise-display data-delay="e" className="block">
              {t("name.last")}
            </span>
          </span>
        </h1>

        <div className="term-clip">
          <p
            data-rise
            data-delay="f"
            className="text-lead font-light uppercase text-term-muted"
          >
            {t("subtitle")}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-6">
        <span data-fade data-delay="g">
          <TerminalPrompt path={t("prompt.path")} command={t("prompt.command")} />
        </span>

        <div
          data-fade
          data-delay="h"
          className="hidden items-center gap-3 text-label uppercase text-term-muted md:flex"
        >
          <span>{t("scroll")}</span>
          <span
            aria-hidden="true"
            data-scroll-hint
            className="block h-hint w-px bg-gradient-to-b from-term-muted to-transparent"
          />
        </div>
      </div>
    </section>
  );
}
