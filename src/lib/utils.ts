import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * Chaves de `theme.extend.fontSize` do `tailwind.config.ts` — a escala do
 * "Dev Terminal".
 *
 * **Sem esta lista o `twMerge` apaga a escala tipográfica em silêncio.** Ele
 * decide se um `text-*` é tamanho ou cor pelo formato do sufixo: `text-2xl`
 * casa com t-shirt size e entra no grupo `font-size`; `text-command` não casa
 * com nada e cai no grupo `text-color`. Aí `cn("text-command", "text-term-text")`
 * vê duas cores no mesmo grupo, mantém a última e descarta o tamanho — a
 * linha digitada renderizou a 16px em vez de 41.6px por causa exatamente
 * disso, e nada no build, no type-check ou no lint acusou.
 *
 * Chave nova em `fontSize` entra aqui junto. As duas listas têm que casar; o
 * sintoma de esquecer é texto no tamanho errado onde `cn` recebe cor e
 * tamanho na mesma chamada.
 */
const TERM_FONT_SIZES = [
  'display',
  'project',
  'marquee',
  'lead',
  'prompt',
  'label',
  'label-wide',
  'project-meta',
  'command',
  'body',
] as const;

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: [...TERM_FONT_SIZES] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
