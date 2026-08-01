import "../../globals.css";
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/src/i18n/routing";
import { ThemeProvider } from "@/src/components/theme-provider";
import { Toaster } from "@/src/components/ui/toaster";
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
 * `jetbrainsMono.variable` apenas expõe `--font-mono` — declarar a variável
 * não aplica a fonte. Quem aplica é o `font-family` de `.theme-terminal`.
 *
 * O `<body>` não tem família própria de propósito: a Sora vive só na home
 * antiga, que é quem ainda a usa. Deixá-la aqui fazia o /v2 baixar e
 * precarregar ~36 KiB de uma fonte que ele nem desenha.
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
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
