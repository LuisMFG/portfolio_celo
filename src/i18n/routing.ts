import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales:    ['en', 'pt-BR'],   // idiomas suportados
  defaultLocale: 'pt-BR'         // idioma padrão
});
