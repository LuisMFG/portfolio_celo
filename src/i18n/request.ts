// src/i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;       // string | undefined

  // Se não vier nada ou vier algo inválido, cai no defaultLocale
  if (!requested || !hasLocale(routing.locales, requested)) {
    return {
      locale: routing.defaultLocale, 
      messages: (await import(`../../messages/${routing.defaultLocale}.json`)).default
    };
  }

  // Aqui o TS já sabe que `requested` é string
  return {
    locale: requested,
    messages: (await import(`../../messages/${requested}.json`)).default
  };
});
