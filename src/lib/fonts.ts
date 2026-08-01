import localFont from "next/font/local";

/**
 * Subset latin + latin-ext, nos ranges canônicos do Google Fonts.
 *
 * Os arquivos em `src/fonts` foram subsetados com `pyftsubset` a partir do
 * release oficial (JetBrainsMono 2.304), mantendo
 * `kern,liga,calt,ccmp,locl,mark,mkmk`. As ligaduras de código (`liga`,
 * `calt`) ficam de propósito: são a assinatura da JetBrains Mono e o
 * conceito inteiro depende delas. 91.7 KiB -> 22.6 KiB por peso.
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
 * O `preload` do next/font é por chamada, não por peso: não há como
 * precarregar só o 500 sem quebrar a família em duas, o que faria o
 * navegador sintetizar peso em vez de usar o arquivo certo. Quando o hero
 * existir, remedir; se o FOUT no display incomodar, o caminho é um loader
 * separado usado só por ele.
 */
export const jetbrainsMono = localFont({
  src: [
    { path: "../fonts/JetBrainsMono-Light.woff2", weight: "300", style: "normal" },
    { path: "../fonts/JetBrainsMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/JetBrainsMono-Medium.woff2", weight: "500", style: "normal" },
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
