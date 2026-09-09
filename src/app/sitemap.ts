import type { MetadataRoute } from "next";
import { routing } from "@/src/i18n/routing";
import { SITE_URL, localePath, languageAlternates } from "@/src/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url: `${SITE_URL}${localePath(locale)}`,
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(
        Object.entries(languageAlternates()).map(([key, path]) => [
          key,
          `${SITE_URL}${path}`,
        ])
      ),
    },
  }));
}
