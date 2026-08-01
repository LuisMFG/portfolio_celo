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
 * Alinhamento é `items-center`, não o `baseline` do protótipo: os controles
 * têm 44px de altura por causa do alvo de toque e o baseline os desalinharia.
 */
export async function SiteHeader() {
  const t = await getTranslations("Header");

  return (
    <header className="relative z-10 flex items-center justify-between gap-4 text-label uppercase text-term-muted">
      <div className="overflow-hidden">
        <div data-rise="a">{t("identity")}</div>
      </div>

      <div className="hidden overflow-hidden md:block">
        <div data-rise="b">{t("location")}</div>
      </div>

      <div className="hidden overflow-hidden md:block">
        <div data-rise="c">{t("version")}</div>
      </div>

      <div className="overflow-hidden">
        <div className="flex items-center gap-2" data-rise="d">
          <LocaleControl />
          <ThemeControl />
        </div>
      </div>
    </header>
  );
}
