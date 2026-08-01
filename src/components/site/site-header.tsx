import { getTranslations } from "next-intl/server";
import { LocaleControl } from "./locale-control";
import { ThemeControl } from "./theme-control";

/**
 * Header do protótipo (`prototype.html:61-65`) mais os controles de idioma
 * e tema.
 *
 * A 375px `location` e `version` somem por media query — nunca por render
 * condicional, que causaria hydration mismatch e shift. A localização passa
 * a ser responsabilidade da seção "sobre" no mobile.
 *
 * A identidade também encolhe para só `LM`: medido, identidade inteira mais
 * os dois controles pedem 381px contra 335 de linha útil a 375px, e o
 * segundo controle era cortado em 29px. O sufixo `— full-stack` é o que sai
 * porque é redundante com o subtítulo do hero, que fica 40px abaixo em
 * escala muito maior e sempre co-visível — o header não é fixo. Com `LM` o
 * header fecha em 269px e sobrevive até 320px. Os controles ficam inteiros,
 * com `aria-current` e `aria-pressed` intactos: mostrar só a alternativa
 * tornaria `[en]` ambíguo entre estado e ação.
 *
 * Alinhamento é `items-center`, não o `baseline` do protótipo: os controles
 * têm 44px de altura por causa do alvo de toque e o baseline os desalinharia.
 */
export async function SiteHeader() {
  const t = await getTranslations("Header");

  return (
    <header className="relative z-10 flex items-center justify-between gap-4 px-gutter pt-7 text-label uppercase text-term-muted">
      <div className="overflow-hidden">
        <div data-rise data-delay="a">
          {t("identity")}
          <span className="hidden md:inline">{` ${t("identitySuffix")}`}</span>
        </div>
      </div>

      <div className="hidden overflow-hidden md:block">
        <div data-rise data-delay="b">
          {t("location")}
        </div>
      </div>

      <div className="hidden overflow-hidden md:block">
        <div data-rise data-delay="c">
          {t("version")}
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="flex items-center gap-2" data-rise data-delay="d">
          <LocaleControl />
          <ThemeControl />
        </div>
      </div>
    </header>
  );
}
