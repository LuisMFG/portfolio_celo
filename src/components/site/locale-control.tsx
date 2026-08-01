"use client";

import { Fragment } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/src/i18n/navigation";

/** Ordem de exibição do protótipo: `[pt-br|en]`. */
const DISPLAY_ORDER = ["pt-BR", "en"] as const;
const LABEL: Record<(typeof DISPLAY_ORDER)[number], string> = {
  "pt-BR": "pt-br",
  en: "en",
};

/**
 * Controle de idioma na linguagem de colchetes do protótipo.
 *
 * O locale ativo é um `<span aria-current>` e o inativo é um `<Link>` do
 * next-intl, que resolve o prefixo sozinho — com `localePrefix: 'as-needed'`
 * o pt-BR mora na raiz e não tem prefixo nenhum.
 *
 * `aria-current` carrega o estado fora da cor, então a cor é reforço e não
 * canal único (WCAG 1.4.1). O `aria-label` começa pelo texto
 * visível por causa do WCAG 2.5.3 (Label in Name). Alvos de toque de 44px vêm de `min-h-tap
 * min-w-tap`, sem inflar os 11px da fonte.
 */
export function LocaleControl() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Header");

  return (
    <div className="flex items-center text-label uppercase">
      <span aria-hidden="true" className="text-term-muted">
        [
      </span>

      {DISPLAY_ORDER.map((code, i) => (
        <Fragment key={code}>
          {i > 0 && (
            <span aria-hidden="true" className="text-term-muted">
              |
            </span>
          )}
          {code === locale ? (
            <span
              aria-current="true"
              className="inline-flex min-h-tap min-w-tap items-center justify-center text-term-accent"
            >
              {LABEL[code]}
            </span>
          ) : (
            <Link
              href={pathname}
              locale={code}
              lang={code}
              hrefLang={code}
              aria-label={`${LABEL[code]} — ${t(`switchTo.${code}`)}`}
              className="inline-flex min-h-tap min-w-tap items-center justify-center text-term-muted transition-colors duration-300 ease-term hover:text-term-accent focus-visible:text-term-accent"
            >
              {LABEL[code]}
            </Link>
          )}
        </Fragment>
      ))}

      <span aria-hidden="true" className="text-term-muted">
        ]
      </span>
    </div>
  );
}
