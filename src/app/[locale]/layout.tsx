// src/app/[locale]/layout.tsx
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/src/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // 1. 'params' é tratado como um objeto dinâmico, então precisamos aguardar
  const { params, children } = props;
  const { locale } = await params;

  // 2. Valida se o locale faz parte dos suportados
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // 3. Configura o locale no contexto de internacionalização
  setRequestLocale(locale);

  // 4. Renderiza o provedor de traduções envolvendo os children
  return <NextIntlClientProvider>{children}</NextIntlClientProvider>;
}
