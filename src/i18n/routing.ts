import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'pt-BR'],
  defaultLocale: 'pt-BR',
  // pt-BR é servido na raiz `/` por rewrite interno, sem o hop 307 que o
  // default 'always' provocava. `localeDetection: false` mantém `/` estático:
  // sem variação por Accept-Language, sem redirect para quem chega em inglês.
  localePrefix: 'as-needed',
  localeDetection: false
});
