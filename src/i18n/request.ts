
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;


  if (!requested || !hasLocale(routing.locales, requested)) {
    return {
      locale: routing.defaultLocale,
      messages: (await import(`../../messages/${routing.defaultLocale}.json`)).default
    };
  }

  return {
    locale: requested,
    messages: (await import(`../../messages/${requested}.json`)).default
  };
});
