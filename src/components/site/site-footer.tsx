import { getTranslations } from "next-intl/server";

const LINKS = [
  { key: "github", href: "https://github.com/LuisMFG" },
  { key: "linkedin", href: "https://linkedin.com/in/celodev11" },
  { key: "mail", href: "mailto:lmfg10@gmail.com" },
] as const;

/**
 * Footer do protótipo (`prototype.html:147-152`).
 *
 * Cada link tem texto visível como nome acessível mais um `aria-label`
 * descrevendo o destino — o baseline perde pontos hoje em "links sem nome
 * discernível" por causa dos ícones da sidebar, e o padrão não se repete aqui.
 */
export async function SiteFooter() {
  const t = await getTranslations("Footer");

  return (
    <footer className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-term-line px-gutter pb-10 pt-7 text-label uppercase text-term-muted">
      {LINKS.map(({ key, href }) => (
        <a
          key={key}
          href={href}
          {...(href.startsWith("http")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          aria-label={t(`links.${key}`)}
          className="inline-flex min-h-tap items-center transition-colors duration-300 ease-term hover:text-term-accent focus-visible:text-term-accent"
        >
          {key}
        </a>
      ))}

      <span className="inline-flex min-h-tap items-center">{t("exit")}</span>
    </footer>
  );
}
