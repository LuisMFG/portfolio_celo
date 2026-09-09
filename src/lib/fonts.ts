import localFont from "next/font/local";

/**
 * Fonte variável, subset latin + latin-ext nos ranges canônicos do Google
 * Fonts, com o eixo `wght` recortado em 300–500 — a faixa inteira que a
 * escala tipográfica usa, e nada além dela.
 *
 * Vem do `JetBrainsMono[wght].ttf` do release oficial (2.304), instanciado
 * e subsetado com fonttools, mantendo `kern,liga,calt,ccmp,locl,mark,mkmk`.
 * As ligaduras de código (`liga`, `calt`) ficam de propósito: são a
 * assinatura da JetBrains Mono e o conceito inteiro depende delas.
 *
 * ```
 * fonttools varLib.instancer 'JetBrainsMono[wght].ttf' wght=300:500 -o partial.ttf
 * pyftsubset partial.ttf --output-file=src/fonts/JetBrainsMono-Variable.woff2 \
 *   --flavor=woff2 --unicodes="<latin>,<latin-ext>" \
 *   --layout-features="kern,liga,calt,ccmp,locl,mark,mkmk" \
 *   --no-hinting --desubroutinize
 * ```
 *
 * Substituiu três estáticos de ~22 KiB cada. Não foi só o byte: 67.1 KiB em
 * três requisições viraram 38.8 KiB em uma, e como os três pesos estavam
 * todos em uso (500 no display, 400 nos labels, 300 no subtítulo), não
 * havia peso ocioso a cortar. Medido, os estáticos custavam ~300ms de LCP
 * na simulação móvel do Lighthouse — o orçamento inteiro do redesign,
 * gasto só em fonte.
 *
 * Se um dia entrar caractere fora desses ranges, ele cai no fallback e some
 * do desenho sem erro nenhum — refaça o subset em vez de trocar a fonte.
 *
 * Expõe `--font-mono`. Declarar a variável não aplica a fonte — quem aplica
 * é o `font-family` de `.theme-terminal`.
 *
 * `preload: false` é deliberado. Com `display: 'swap'` o período de bloqueio
 * é ~zero: o texto pinta imediatamente no fallback métrico que o next/font
 * gera, então o LCP não espera fonte nenhuma. Precarregar só adiantaria o
 * fim do FOUT, ao custo de 67 KiB disputando banda no momento mais caro —
 * que foi exatamente o que levou o LCP a 3.8s.
 *
 * Com um arquivo só, o argumento contra o preload perde metade da força —
 * não há mais peso ocioso a baixar. Continua `false` porque o LCP é texto e
 * o `swap` já o pinta no fallback métrico: precarregar adiantaria o fim do
 * FOUT, não o LCP. Reavaliar quando o hero deixar de ser o elemento LCP.
 */
export const jetbrainsMono = localFont({
  src: [
    {
      path: "../fonts/JetBrainsMono-Variable.woff2",
      // Faixa, não peso fixo: o navegador interpola 300/400/500 do mesmo
      // arquivo em vez de sintetizar.
      weight: "300 500",
      style: "normal",
    },
  ],
  display: "swap",
  preload: false,
  variable: "--font-mono",
  // Literal único e numa linha só: o next/font recusa variável, template ou
  // concatenação. Ordem: range latin, depois latin-ext, nos valores
  // canônicos do Google Fonts — os mesmos passados ao pyftsubset.
  // prettier-ignore
  declarations: [
    { prop: "unicode-range", value: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD,U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF" },
  ],
});
