"use client";

import { Fragment, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

const THEMES = ["dark", "light"] as const;

/**
 * Controle de tema na mesma linguagem do de idioma.
 *
 * Texto, não ícone — o estado nunca depende de um glifo. `aria-pressed`
 * carrega o estado fora da cor. O `aria-label` começa pelo texto visível
 * (WCAG 2.5.3, Label in Name): quem usa comando de voz diz "clicar em
 * dark", e o nome acessível precisa conter essa palavra — só "Ativar
 * tema escuro" reprovava a auditoria.
 *
 * O next-themes só conhece o tema depois de montar (localStorage, sem
 * cookie), então há uma guarda `mounted`: o primeiro render do cliente é
 * idêntico ao do servidor e só depois o estado real aparece. Como os dois
 * segmentos sempre renderizam em fonte monoespaçada e largura fixa, o que
 * muda é a cor — nunca o layout. CLS zero.
 */
export function ThemeControl() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("Header");

  useEffect(() => setMounted(true), []);

  return (
    <div className="flex items-center text-label uppercase">
      <span aria-hidden="true" className="text-term-muted">
        [
      </span>

      {THEMES.map((theme, i) => {
        const active = mounted && resolvedTheme === theme;
        return (
          <Fragment key={theme}>
            {i > 0 && (
              <span aria-hidden="true" className="text-term-muted">
                |
              </span>
            )}
            <button
              type="button"
              onClick={() => setTheme(theme)}
              aria-pressed={mounted ? active : undefined}
              aria-label={`${theme} — ${t(`theme.${theme}`)}`}
              className={`inline-flex min-h-tap min-w-tap items-center justify-center transition-colors duration-300 ease-term hover:text-term-accent focus-visible:text-term-accent ${
                active ? "text-term-accent" : "text-term-muted"
              }`}
            >
              {theme}
            </button>
          </Fragment>
        );
      })}

      <span aria-hidden="true" className="text-term-muted">
        ]
      </span>
    </div>
  );
}
