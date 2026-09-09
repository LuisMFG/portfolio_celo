import "../../globals.css";
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/src/i18n/routing";
import { ThemeProvider } from "@/src/components/theme-provider";
import { jetbrainsMono } from "@/src/lib/fonts";
import { SITE_URL, localePath, languageAlternates } from "@/src/lib/site";

const COPY = {
  "pt-BR": {
    title: "Luis Marcelo — Desenvolvedor Full Stack",
    description:
      "Portfólio de Luis Marcelo, desenvolvedor full stack em Porto Velho — RO.",
  },
  en: {
    title: "Luis Marcelo — Full Stack Developer",
    description:
      "Portfolio of Luis Marcelo, full stack developer based in Porto Velho, Brazil.",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const copy = COPY[locale as keyof typeof COPY] ?? COPY["pt-BR"];
  const canonical = localePath(locale);

  return {
    metadataBase: new URL(SITE_URL),
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical,
      languages: languageAlternates(),
    },
    openGraph: {
      type: "website",
      locale,
      url: canonical,
      siteName: "Luis Marcelo",
      title: copy.title,
      description: copy.description,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

/**
 * Root layout do site público. Tem o próprio `<html>` para que `lang`
 * acompanhe o locale — o admin tem o seu em `(admin)/layout.tsx`.
 *
 * `.theme-terminal` mora no **`<body>`**, não num wrapper interno como era no
 * `v2/layout.tsx`. É essa subida que mata o `--term-doc-bg`: aquele token só
 * existia porque `--bg` vivia dentro do wrapper e o `<body>` ficava de fora,
 * pintado pelo shadcn. Com a classe no `<body>`, `background-color: var(--bg)`
 * já é a regra de `.theme-terminal` e não há segunda cópia das duas cores.
 *
 * O `<div>` interno continua existindo, mas só com responsabilidade de
 * layout — `overflow-x: clip` no `<body>` propagaria para o viewport, que é
 * exatamente o que se quer evitar.
 *
 * `jetbrainsMono.variable` no `<html>` apenas expõe `--font-mono`; quem aplica
 * a fonte e os tokens é o `font-family` de `.theme-terminal`.
 *
 * Regras de scroll, decididas antes da fase de movimento e mantidas na
 * promoção: **o `<body>` é quem rola.** Nenhum `h-screen` + `overflow-y-auto`
 * em wrapper, nenhum `scroll-snap` — os dois quebrariam o Lenis (que assume
 * `window`) e o IntersectionObserver com `root: null`.
 *
 * `overflow-x: clip` no wrapper, não em `html`: `clip` recorta sem criar
 * contexto de scroll, enquanto `hidden` transformaria o elemento em contêiner
 * de scroll e mataria `position: sticky`.
 *
 * A Sora saiu junto com a home antiga — ela vivia na `page.tsx` velha
 * justamente para não ser baixada por quem não a desenha.
 */
export default async function LocaleLayout({ params, children }: LayoutProps) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={jetbrainsMono.variable}
    >
      <body className="theme-terminal">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="relative min-h-svh [overflow-x:clip]">
              {children}
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
