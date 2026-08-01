import { routing } from "@/src/i18n/routing";

/**
 * Origem canônica do site. Serve de `metadataBase`, então é ela que resolve
 * as URLs relativas de canonical, hreflang e Open Graph.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://luismarceloportfolio.vercel.app")
).replace(/\/$/, "");

/**
 * Caminho de um locale sob `localePrefix: 'as-needed'`: o default mora na
 * raiz, os demais ganham prefixo. Nada aqui pode devolver `/pt-BR`.
 */
export function localePath(locale: string, path = "") {
  const suffix = path.replace(/^\/$/, "");
  return locale === routing.defaultLocale
    ? `/${suffix}`.replace(/\/+$/, "") || "/"
    : `/${locale}${suffix}`;
}

/** Mapa hreflang completo, incluindo x-default apontando para a raiz. */
export function languageAlternates(path = "") {
  return {
    ...Object.fromEntries(
      routing.locales.map((locale) => [locale, localePath(locale, path)])
    ),
    "x-default": localePath(routing.defaultLocale, path),
  };
}
