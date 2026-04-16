import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { fetchSiteContent, type Locale } from "@/src/lib/content";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale =
    requested && hasLocale(routing.locales, requested)
      ? requested
      : routing.defaultLocale;

  const messages = (await import(`../../messages/${locale}.json`)).default;

  const dbContent = await fetchSiteContent(locale as Locale);
  if (dbContent.hero && messages.HeroSection) {
    Object.assign(messages.HeroSection, dbContent.hero);
  }
  if (dbContent.about && messages.AboutSection) {
    Object.assign(messages.AboutSection, dbContent.about);
  }

  return { locale, messages };
});
